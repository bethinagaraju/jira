
import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Col, Row, Badge } from 'react-bootstrap';
import { BsPlus, BsX } from 'react-icons/bs';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './ProjectModal.css';

// Animation Variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.3 } },
};

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const ProjectModal = ({ show, setShowModal }) => {
  const { addProject, teamMembers, role } = useTasks();
  const [projectData, setProjectData] = useState({
    name: '',
    members: [],
    description: '',
    startDate: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [memberSearch, setMemberSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMemberToggle = (memberName) => {
    setProjectData((prev) => {
      const members = prev.members.includes(memberName)
        ? prev.members.filter((name) => name !== memberName)
        : [...prev.members, memberName];
      return { ...prev, members };
    });
    setErrors((prev) => ({ ...prev, members: '' }));
  };

  const handleMemberSearch = (e) => {
    setMemberSearch(e.target.value);
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const validate = () => {
    const newErrors = {};
    if (!projectData.name.trim()) newErrors.name = 'Project name is required';
    if (projectData.members.length === 0) newErrors.members = 'At least one member is required';
    if (!projectData.startDate) newErrors.startDate = 'Start date is required';
    if (!projectData.deadline) newErrors.deadline = 'Deadline is required';
    if (projectData.startDate && projectData.deadline && projectData.deadline < projectData.startDate) {
      newErrors.deadline = 'Deadline must be after start date';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      addProject({
        name: projectData.name,
        members: projectData.members,
        description: projectData.description,
        startDate: projectData.startDate,
        deadline: projectData.deadline,
      });
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Project created successfully!',
        life: 3000,
      });
      setProjectData({ name: '', members: [], description: '', startDate: '', deadline: '' });
      setMemberSearch('');
      setShowModal(false);
      setErrors({});
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to create project',
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast ref={toast} position="top-right" style={{ height: '50px' }} />
      <AnimatePresence>
        {show && (
          <Modal show={show} onHide={() => setShowModal(false)} centered backdrop="static">
            <motion.div
              className="modal-content border border-primary rounded-3 shadow-sm"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Create New Project</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-4" controlId="projectName">
                      <Form.Label className="fw-semibold">Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={projectData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Enter project name"
                        className="border-2"
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>



                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-4" controlId="projectMembers">
                      <Form.Label className="fw-semibold">Project Members</Form.Label>
                      <div className="mb-2">
                        {projectData.members.length > 0 ? (
                          projectData.members.map((member) => (
                            <Badge
                              key={member}
                              bg="primary"
                              className="me-1 mb-1 p-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleMemberToggle(member)}
                            >
                              {member} <BsX size={16} />
                            </Badge>
                          ))
                        ) : (
                          <div className="text-muted small">No members selected</div>
                        )}
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Search members..."
                        value={memberSearch}
                        onChange={handleMemberSearch}
                        className="mb-2 border-2"
                      />
                      <div
                        style={{
                          maxHeight: '150px',
                          overflowY: 'auto',
                          border: '1px solid #ced4da',
                          borderRadius: '0.25rem',
                          padding: '0.5rem',
                        }}
                      >
                        {filteredMembers.length > 0 ? (
                          filteredMembers.map((member) => (
                            <div
                              key={member.id}
                              className={`member-item ${projectData.members.includes(member.name) ? 'selected' : ''}`}
                              onClick={() => handleMemberToggle(member.name)}
                            >
                              {member.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-muted">No members found</div>
                        )}
                      </div>
                      {errors.members && (
                        <div className="text-danger small mt-1">{errors.members}</div>
                      )}
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-4" controlId="projectDescription">
                      <Form.Label className="fw-semibold">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={projectData.description}
                        onChange={handleChange}
                        placeholder="Enter project description"
                        className="border-2"
                      />
                    </Form.Group>
                  </motion.div>



                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-4" controlId="projectStartDate">
                      <Form.Label className="fw-semibold">Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={projectData.startDate}
                        onChange={handleChange}
                        isInvalid={!!errors.startDate}
                        className="border-2"
                      />
                      <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-4" controlId="projectDeadline">
                      <Form.Label className="fw-semibold">Deadline</Form.Label>
                      <Form.Control
                        type="date"
                        name="deadline"
                        value={projectData.deadline}
                        onChange={handleChange}
                        isInvalid={!!errors.deadline}
                        className="border-2"
                      />
                      <Form.Control.Feedback type="invalid">{errors.deadline}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  <Row className="mt-4">
                    <Col className="text-end">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowModal(false)}
                        className="me-2 px-4"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="px-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Creating...</span>
                        ) : (
                          <>
                            <BsPlus size={16} className="me-1" /> Create Project
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectModal;