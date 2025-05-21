import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NewTaskModal.css'; // Import the CSS file

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

const NewTaskModal = ({ show, setShowModal, projectName }) => {
  const { addTask, teamMembers, projects, tasks, canCreateTasks } = useTasks();

  const defaultReporter = teamMembers.find(m => m.isYou)?.name || (teamMembers.length > 0 ? teamMembers[0].name : '');

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    assignee: '',
    dueDate: '',
    project: projectName || '',
    workType: 'Task',
    reporter: defaultReporter,
    labels: [],
    epic: '',
    parent: '',
    team: '',
    linkedWorkItems: { blocks: '', blockedBy: '' },
    attachments: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null); // Reference to ReactQuill editor

  const canCreate = canCreateTasks();

  const assigneeOptions = (() => {
    if (!taskData.project) {
      return teamMembers.map((member) => member.name);
    }
    const selectedProject = projects.find((project) => project.name === taskData.project);
    if (!selectedProject) {
      return [];
    }
    return teamMembers
      .filter((member) => selectedProject.members.includes(member.name))
      .map((member) => member.name);
  })();

  const epicOptions = (() => {
    if (!taskData.project || !['Task', 'Bug'].includes(taskData.workType)) return [];
    return tasks
      .filter(task => task.project === taskData.project && task.workType === 'Epic')
      .map(task => ({
        id: task.id,
        title: task.title,
      }));
  })();

  const parentOptions = (() => {
    if (!taskData.workType || !taskData.project) return [];

    const projectTasks = tasks.filter(task => task.project === taskData.project);

    if (taskData.workType === 'Epic') {
      return projects.map(project => ({
        id: project.id,
        title: project.name,
        type: 'Project',
      }));
    } else if (taskData.workType === 'Story') {
      return projectTasks
        .filter(task => task.workType === 'Epic')
        .map(task => ({
          id: task.id,
          title: task.title,
          type: 'Epic',
        }));
    } else if (taskData.workType === 'Task' || taskData.workType === 'Bug') {
      if (!taskData.epic) return [];
      return projectTasks
        .filter(task => task.workType === 'Story' && task.parent === taskData.epic)
        .map(task => ({
          id: task.id,
          title: task.title,
          type: 'Story',
        }));
    }
    return [];
  })();

  useEffect(() => {
    if (!taskData.project || !taskData.assignee) return;
    const selectedProject = projects.find((project) => project.name === taskData.project);
    if (!selectedProject) {
      setTaskData((prev) => ({ ...prev, assignee: '' }));
      return;
    }
    const validAssignees = teamMembers
      .filter((member) => selectedProject.members.includes(member.name))
      .map((member) => member.name);
    if (!validAssignees.includes(taskData.assignee)) {
      setTaskData((prev) => ({ ...prev, assignee: '' }));
    }
  }, [taskData.project, projects, teamMembers]);

  useEffect(() => {
    setTaskData((prev) => {
      const newEpic = ['Task', 'Bug'].includes(taskData.workType) ? prev.epic : '';
      let newParent = prev.parent;
      const projectTasks = tasks.filter(task => task.project === taskData.project);
      const validEpics = projectTasks.filter(task => task.workType === 'Epic').map(task => task.id);

      if (taskData.workType === 'Epic') {
        const selectedProject = projects.find(p => p.name === taskData.project);
        newParent = selectedProject ? selectedProject.id : '';
      } else if (taskData.workType === 'Story') {
        if (prev.project !== taskData.project && !validEpics.includes(prev.parent)) {
          newParent = '';
        }
      } else if (['Task', 'Bug'].includes(taskData.workType)) {
        if (!taskData.epic) {
          newParent = '';
        }
      }

      return { ...prev, epic: newEpic, parent: newParent };
    });
  }, [taskData.workType, taskData.project, projects, tasks]);

  useEffect(() => {
    if (['Task', 'Bug'].includes(taskData.workType) && !taskData.epic) {
      setTaskData((prev) => ({ ...prev, parent: '' }));
    }
  }, [taskData.epic]);

  // Custom image handler for ReactQuill
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', base64Image);
          // Add the image file to attachments
          setTaskData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, file],
          }));
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Attach the image handler to the Quill toolbar
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', handleImageUpload);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to: ${value}`);
    setTaskData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDescriptionChange = (value) => {
    setTaskData((prev) => ({ ...prev, description: value }));
  };

  const handleLinkedWorkItemsChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      linkedWorkItems: { ...prev.linkedWorkItems, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTaskData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
    // Embed image files in the description
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true) || { index: quill.getLength() };
          quill.insertEmbed(range.index, 'image', base64Image);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeAttachment = (index) => {
    setTaskData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleLabelsChange = (e) => {
    const selectedLabels = Array.from(e.target.selectedOptions, (option) => option.value);
    setTaskData((prev) => ({ ...prev, labels: selectedLabels }));
  };

  const validate = () => {
    const newErrors = {};
    if (!taskData.title?.trim()) newErrors.title = 'Summary is required';
    if (!taskData.project?.trim()) newErrors.project = 'Project is required';
    if (!taskData.workType?.trim()) newErrors.workType = 'Work type is required';
    if (!taskData.reporter?.trim()) newErrors.reporter = 'Reporter is required';
    if (['Story', 'Task', 'Bug'].includes(taskData.workType) && !taskData.parent) {
      newErrors.parent = `${taskData.workType} must have a parent ${taskData.workType === 'Story' ? 'Epic' : 'Story'}`;
    }
    if (taskData.workType === 'Epic' && !taskData.parent) {
      newErrors.parent = 'Epic must have a parent Project';
    }
    if (['Task', 'Bug'].includes(taskData.workType) && !taskData.epic) {
      newErrors.epic = `${taskData.workType} must have a parent Epic`;
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting task data:', taskData);
    console.log('Parent value:', taskData.parent);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000,
      });
      return;
    }

    if (!canCreate) {
      console.log('Permission denied: User cannot create tasks');
      toast.current.show({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to create tasks',
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const taskToSubmit = { ...taskData };
      if (!['Task', 'Bug'].includes(taskData.workType)) {
        delete taskToSubmit.epic;
      }
      console.log('Final task to submit:', taskToSubmit);
      addTask(taskToSubmit);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Task created successfully!',
        life: 3000,
      });
      if (!createAnother) {
        setShowModal(false);
      }
      setTaskData({
        title: '',
        description: '',
        status: 'Todo',
        assignee: '',
        dueDate: '',
        project: projectName || '',
        workType: 'Task',
        reporter: defaultReporter,
        labels: [],
        epic: '',
        parent: '',
        team: '',
        linkedWorkItems: { blocks: '', blockedBy: '' },
        attachments: [],
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating task:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to create task',
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = ['Todo', 'In Progress', 'In Review', 'Done'];
  const projectOptions = projects.map((project) => project.name);
  const workTypeOptions = ['Epic', 'Story', 'Task', 'Bug'];
  const teamOptions = projects.map((project) => project.name);
  const labelOptions = ['Urgent', 'High Priority', 'Low Priority', 'Feature', 'Bug'];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <>
      <Toast ref={toast} position="top-right" style={{ height: '50px' }} />
      <AnimatePresence>
        {show && (
          <Modal show centered onHide={() => setShowModal(false)} backdrop="static" dialogClassName="jira-modal">
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Modal.Header closeButton>
                <Modal.Title>Create</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <small className="required-note mb-3 d-block">
                    Required fields are marked with an asterisk *
                  </small>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskProject">
                      <Form.Label>Project</Form.Label>
                      <Form.Select
                        name="project"
                        value={taskData.project}
                        onChange={handleChange}
                        isInvalid={!!errors.project}
                        disabled={!canCreate}
                      >
                        <option value="">Select project</option>
                        {projectOptions.map((project) => (
                          <option key={project} value={project}>
                            {project}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.project}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskWorkType">
                      <Form.Label>Work type</Form.Label>
                      <Form.Select
                        name="workType"
                        value={taskData.workType}
                        onChange={handleChange}
                        isInvalid={!!errors.workType}
                        disabled={!canCreate}
                      >
                        <option value="">Select work type</option>
                        {workTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.workType}</Form.Control.Feedback>
                      <small>
                        <a href="#" className="text-primary">Learn about work types</a>
                      </small>
                    </Form.Group>
                  </motion.div>

                  {(taskData.workType === 'Task' || taskData.workType === 'Bug') && (
                    <motion.div variants={inputVariants} initial="hidden" animate="visible">
                      <Form.Group className="mb-3" controlId="taskEpic">
                        <Form.Label>Epic</Form.Label>
                        <Form.Select
                          name="epic"
                          value={taskData.epic}
                          onChange={handleChange}
                          isInvalid={!!errors.epic}
                          disabled={!canCreate || !taskData.project}
                        >
                          <option value="">Select Epic</option>
                          {epicOptions.map((epic) => (
                            <option key={epic.id} value={epic.id}>
                              {epic.title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.epic}</Form.Control.Feedback>
                        <small className="form-text">
                          Select the Epic this {taskData.workType} belongs to.
                        </small>
                      </Form.Group>
                    </motion.div>
                  )}

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskParent">
                      <Form.Label>
                        {taskData.workType === 'Epic' ? 'Parent Project' : taskData.workType === 'Story' ? 'Parent Epic' : 'Parent Story'}
                        {taskData.workType !== 'Epic' ? ' *' : ''}
                      </Form.Label>
                      <Form.Select
                        name="parent"
                        value={taskData.parent}
                        onChange={handleChange}
                        isInvalid={!!errors.parent}
                        disabled={
                          !canCreate ||
                          !taskData.project ||
                          !taskData.workType ||
                          ((taskData.workType === 'Task' || taskData.workType === 'Bug') && !taskData.epic)
                        }
                      >
                        <option value="">Select parent</option>
                        {parentOptions.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.type}: {parent.title}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.parent}</Form.Control.Feedback>
                      <small className="form-text">
                        Select the parent {taskData.workType === 'Epic' ? 'Project' : taskData.workType === 'Story' ? 'Epic' : 'Story'} for this {taskData.workType}.
                      </small>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskStatus">
                      <Form.Label className="no-asterisk">Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={taskData.status}
                        onChange={handleChange}
                        isInvalid={!!errors.status}
                        disabled={!canCreate}
                      >
                        <option value="">Select status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                      <small className="form-text">This is the initial status upon creation</small>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskTitle">
                      <Form.Label>Summary</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title}
                        placeholder="Summary"
                        disabled={!canCreate}
                      />
                      <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskDescription">
                      <Form.Label className="no-asterisk">Description</Form.Label>
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={taskData.description}
                        onChange={handleDescriptionChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe the issue..."
                        readOnly={!canCreate}
                      />
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskAssignee">
                      <Form.Label className="no-asterisk">Assignee</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Select
                          name="assignee"
                          value={taskData.assignee}
                          onChange={handleChange}
                          style={{ flex: 1 }}
                          disabled={!canCreate}
                        >
                          <option value="">Automatic</option>
                          {assigneeOptions.map((assignee) => (
                            <option key={assignee} value={assignee}>
                              {assignee}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="link"
                          onClick={() => setTaskData((prev) => ({ ...prev, assignee: teamMembers.find(m => m.isYou)?.name || '' }))}
                          className="ms-2"
                          disabled={!canCreate}
                        >
                          Assign to me
                        </Button>
                      </div>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskLabels">
                      <Form.Label className="no-asterisk">Labels</Form.Label>
                      <Form.Select
                        multiple
                        name="labels"
                        value={taskData.labels}
                        onChange={handleLabelsChange}
                        disabled={!canCreate}
                      >
                        {labelOptions.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskTeam">
                      <Form.Label className="no-asterisk">Team</Form.Label>
                      <Form.Select name="team" value={taskData.team} onChange={handleChange} disabled={!canCreate}>
                        <option value="">Choose a team</option>
                        {teamOptions.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </Form.Select>
                      <small className="form-text">
                        Associate a team to an issue. You can use this field to search and filter issues by team.
                      </small>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskReporter">
                      <Form.Label>Reporter</Form.Label>
                      <Form.Select
                        name="reporter"
                        value={taskData.reporter}
                        onChange={handleChange}
                        isInvalid={!!errors.reporter}
                        disabled={!canCreate}
                      >
                        <option value="">Select reporter</option>
                        {teamMembers.map((member) => (
                          <option key={member.name} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.reporter}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskDueDate">
                      <Form.Label className="no-asterisk">Due Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleChange}
                        isInvalid={!!errors.dueDate}
                        disabled={!canCreate}
                      />
                      <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>

                  {/* <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskAttachment">
                      <Form.Label className="no-asterisk">Attachment</Form.Label>
                      <div className="attachment-box p-3 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          disabled={!canCreate}
                        />
                        <Button
                          variant="link"
                          onClick={() => fileInputRef.current.click()}
                          className="me-2"
                          disabled={!canCreate}
                        >
                          Drop files to attach or <span className="text-primary">Browse</span>
                        </Button>
                        {taskData.attachments.length > 0 && (
                          <div className="mt-2">
                            {taskData.attachments.map((file, index) => (
                              <div key={index} className="attachment-item d-flex align-items-center justify-content-center">
                                <span>{file.name}</span>
                                <Button
                                  variant="link"
                                  className="text-danger ms-2"
                                  onClick={() => removeAttachment(index)}
                                  disabled={!canCreate}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </motion.div> */}

                  <motion.div variants={inputVariants} initial="hidden" animate="visible">
                    <Form.Group className="mb-3" controlId="taskLinkedWorkItems">
                      <Form.Label className="no-asterisk">Linked work items</Form.Label>
                      <Form.Select
                        name="blocks"
                        value={taskData.linkedWorkItems.blocks}
                        onChange={handleLinkedWorkItemsChange}
                        className="mb-2"
                        disabled={!canCreate}
                      >
                        <option value="">blocks</option>
                        {tasks
                          .filter(task => task.project === taskData.project)
                          .map((task) => (
                            <option key={task.id} value={task.id}>
                              {task.title}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Select
                        name="blockedBy"
                        value={taskData.linkedWorkItems.blockedBy}
                        onChange={handleLinkedWorkItemsChange}
                        disabled={!canCreate}
                      >
                        <option value="">blocked by</option>
                        {tasks
                          .filter(task => task.project === taskData.project)
                          .map((task) => (
                            <option key={task.id} value={task.id}>
                              {task.title}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </motion.div>

                  <Row className="mt-4 align-items-center">
                    <Col>
                      <Form.Check
                        type="checkbox"
                        label="Create another"
                        checked={createAnother}
                        onChange={(e) => setCreateAnother(e.target.checked)}
                        disabled={!canCreate}
                      />
                    </Col>
                    <Col className="text-end">
                      <Button
                        variant="link"
                        onClick={() => setShowModal(false)}
                        className="me-2"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting || !canCreate}
                      >
                        {isSubmitting ? (
                          <span>Creating...</span>
                        ) : (
                          <>
                            <BsPlus size={16} className="me-1" /> Create
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

export default NewTaskModal;