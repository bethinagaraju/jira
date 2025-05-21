import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { useTasks } from '../context/TaskContext';
import TaskFilters from '../components/TaskFilters';
import TaskKanbanView from '../components/TaskKanbanView';
import TaskTableView from '../components/TaskTableView';
import TaskCalendarView from '../components/TaskCalendarView';
import ViewToggle from '../components/ViewToggle';
import NewTaskModal from '../components/NewTaskModal';
import './ProjectDetails.css';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projects, tasks, setTasks, deleteTask, teamMembers, editProject, role, rolePermissions } = useTasks();
  const toast = useRef(null);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <Container fluid className="project-details-wrapper">
        <motion.div initial="hidden" animate="visible" variants={contentVariants}>
          <h1 className="project-title">Project Not Found</h1>
        </motion.div>
      </Container>
    );
  }

  const [activeView, setActiveView] = useState('kanban');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project.name,
    startDate: project.startDate,
    deadline: project.deadline,
    members: project.members,
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditForm({
      name: project.name,
      startDate: project.startDate,
      deadline: project.deadline,
      members: project.members,
    });
  }, [project]);

  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const assigneeOptions = ['All', ...project.members];
  const statusOptions = ['All', 'Todo', 'In Progress', 'In Review', 'Done'];

  const projectTasks = useMemo(() => {
    return tasks.filter((task) => task.project === project.name);
  }, [tasks, project.name]);

  const filteredTasks = useMemo(() => {
    return projectTasks
      .filter((task) => (selectedAssignee === 'All' ? true : task.assignee === selectedAssignee))
      .filter((task) => (selectedStatus === 'All' ? true : task.status === selectedStatus))
      .filter((task) => {
        if (!selectedDate) return true;
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === selectedDate;
      })
      .filter((task) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        const taskDate = new Date(task.dueDate).toLocaleDateString();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.project.toLowerCase().includes(searchLower) ||
          task.assignee.toLowerCase().includes(searchLower) ||
          taskDate.toLowerCase().includes(searchLower) ||
          task.status.toLowerCase().includes(searchLower)
        );
      });
  }, [projectTasks, selectedAssignee, selectedStatus, selectedDate, searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  const [kanbanTasks, setKanbanTasks] = useState({});

  useEffect(() => {
    const grouped = filteredTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push({
        id: task.id.toString(),
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleDateString(),
        assignee: task.assignee,
        project: task.project,
      });
      return acc;
    }, {});

    const allStatuses = ['Todo', 'In Progress', 'In Review', 'Done'];
    allStatuses.forEach((status) => {
      if (!grouped[status]) {
        grouped[status] = [];
      }
    });

    setKanbanTasks(grouped);
  }, [filteredTasks]);

  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = Array.from(kanbanTasks[source.droppableId]);
    const destinationColumn = Array.from(kanbanTasks[destination.droppableId]);
    const [movedTask] = sourceColumn.splice(source.index, 1);
    destinationColumn.splice(destination.index, 0, movedTask);

    setKanbanTasks({
      ...kanbanTasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id.toString() === movedTask.id ? { ...task, status: destination.droppableId } : task
      )
    );
  }, [kanbanTasks, setTasks]);

  const handleDelete = useCallback((taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Task deleted successfully!',
        life: 3000,
      });
    }
  }, [deleteTask, toast]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const startEditing = () => {
    setIsEditing(true);
    setEditForm({
      name: project.name,
      startDate: project.startDate,
      deadline: project.deadline,
      members: project.members,
    });
    setValidationError('');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({
      name: project.name,
      startDate: project.startDate,
      deadline: project.deadline,
      members: project.members,
    });
    setValidationError('');
  };

  const saveEditing = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    let error = '';
    if (!editForm.name.trim()) {
      error = 'Project name cannot be empty';
    } else if (!editForm.startDate) {
      error = 'Start date is required';
    } else if (!editForm.deadline) {
      error = 'Deadline is required';
    } else {
      const startDate = new Date(editForm.startDate);
      const deadline = new Date(editForm.deadline);
      if (isNaN(startDate.getTime()) || isNaN(deadline.getTime())) {
        error = 'Please enter valid dates';
      } else if (deadline < startDate) {
        error = 'Deadline cannot be before start date';
      }
    }

    if (error) {
      setValidationError(error);
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: error,
        life: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (editForm.name !== project.name) {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.project === project.name ? { ...task, project: editForm.name } : task
          );
          return updatedTasks;
        });
      }

      const updatedProject = {
        ...project,
        name: editForm.name,
        startDate: editForm.startDate,
        deadline: editForm.deadline,
        members: editForm.members,
      };
      editProject(project.id, updatedProject);

      setIsEditing(false);
      setValidationError('');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Project updated successfully!',
        life: 3000,
      });
    } catch (error) {
      setValidationError(error.message || 'Failed to update project');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to update project',
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member} from the project?`)) {
      setEditForm((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m !== member),
      }));
    }
  };

  const handleAddMember = (member) => {
    setEditForm((prev) => ({
      ...prev,
      members: [...prev.members, member],
    }));
  };

  const availableMembers = teamMembers
    .map((member) => member.name)
    .filter((name) => !editForm.members.includes(name));

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const [manageProjects, setManageProjects] = useState(false);

  const [manageCreateTasks, setManageCreateTasks] = useState(false);

  useEffect(() => {
    setManageProjects(rolePermissions[role]?.canEditProjects);
    setManageCreateTasks(rolePermissions[role]?.canCreateTasks);
    console.log('canManageProjects', manageProjects);
  }, [role]);


  return (
    <Container fluid className="project-details-wrapper">
      <Toast ref={toast} position="top-right" style={{ height: '50px' }} />
      <motion.div initial="hidden" animate="visible" variants={contentVariants}>
        <div className="project-card">
          {isEditing ? (
            <Form onSubmit={saveEditing}>
              <Row className="mb-0 align-items-center">
                <Col>
                  <Form.Group className="mb-2" controlId="projectName">
                    <Form.Label className="fw-semibold">Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="project-input"
                      placeholder="Enter project name"
                      isInvalid={!!validationError && validationError.includes('name')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationError.includes('name') && validationError}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="projectDescription">
                    <Form.Label className="fw-semibold">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={project.description || ''}
                      readOnly
                      className="project-input"
                      placeholder="No description available"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2" controlId="projectStartDate">
                        <Form.Label className="fw-semibold">Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                          className="project-input"
                          isInvalid={!!validationError && validationError.includes('Start date')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationError.includes('Start date') && validationError}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2" controlId="projectDeadline">
                        <Form.Label className="fw-semibold">Deadline</Form.Label>
                        <Form.Control
                          type="date"
                          value={editForm.deadline}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, deadline: e.target.value }))
                          }
                          className="project-input"
                          isInvalid={!!validationError && validationError.includes('Deadline')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationError.includes('Deadline') && validationError}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2" controlId="projectMembers">
                    <Form.Label className="fw-semibold">Members</Form.Label>
                    <div className="mb-2">
                      {editForm.members.length > 0 ? (
                        editForm.members.map((member) => (
                          <span key={member} className="member-badge">
                            <div className="member-avatar">{getInitials(member)}</div>
                            {member}
                            <button
                              onClick={() => handleDeleteMember(member)}
                              className="member-remove-btn"
                              style={{ backgroundColor: 'transparent', padding: '5px', border: 'none', ':hover': { border: 'none' } }}
                              aria-label={`Remove ${member}`}
                            >
                              <FaTimes size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <div className="text-muted small">No members assigned</div>
                      )}
                    </div>
                    {availableMembers.length > 0 && (
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-primary"
                          className="project-input"
                          disabled={isSubmitting}
                        >
                          Add Member
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {availableMembers.map((member) => (
                            <Dropdown.Item
                              key={member}
                              onClick={() => handleAddMember(member)}
                            >
                              {member}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Form.Group>
                  {validationError && (
                    <div className="text-danger small mb-2">{validationError}</div>
                  )}
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={saveEditing}
                    className="action-btn me-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={cancelEditing}
                    className="action-btn"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : (
            <Row className="mb-0 align-items-center">
              <Col>
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="project-logo"
                    style={{
                      backgroundColor: `${project.color}aa`,
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '20px',
                      marginRight: '10px',
                      color: 'white',
                    }}
                  >
                    {project.short}
                  </div>
                  <div>
                    <h1
                      className="project-title mb-0"
                      style={{ color: '#526D82' }}
                    >
                      {project.name}
                    </h1>
                  </div>
                </div>
                <p
                  className="mb-4"
                  style={{ color: 'rgba(82, 109, 130, 1)' }}

                >
                  {project.description || 'No description available.'}
                </p>
                <Row className="mb-3">
                  <Col md={6}>
                    <div className="text-muted">
                      <strong>Start Date:</strong> {project.startDate}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="text-muted">
                      <strong>Deadline:</strong> {project.deadline}
                    </div>
                  </Col>
                </Row>
                <div className="text-muted">
                  <strong>Members:</strong>
                  {project.members.length > 0 ? (
                    <div className="mt-2">
                      {project.members.map((member) => (
                        <span key={member} className="member-badge">
                          <div className="member-avatar">{getInitials(member)}</div>
                          {member}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted small mt-2">No members assigned.</div>
                  )}
                </div>
              </Col>
              <Col xs="auto">
                <div style={{ display: 'flex' }}>
                  {manageProjects && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={startEditing}
                      className="action-btn me-2"
                    >
                      <FaEdit size={14} className="me-1" /> Edit Project
                    </Button>
                  )}


                  {manageCreateTasks && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowTaskModal(true)}
                      className="action-btn d-flex align-items-center"
                    >
                      <BsPlus size={16} className="me-1" /> New Task
                    </Button>
                  )}

                </div>
              </Col>
            </Row>
          )}
        </div>

        <motion.div
          key={activeView}
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="project-card"
        >
          <Row className="mb-4 align-items-center">
            <ViewToggle activeView={activeView} setActiveView={setActiveView} />
          </Row>

          <TaskFilters
            selectedProject={project.name}
            setSelectedProject={() => { }}
            selectedAssignee={selectedAssignee}
            setSelectedAssignee={setSelectedAssignee}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            projectOptions={[project.name]}
            assigneeOptions={assigneeOptions}
            statusOptions={statusOptions}
            isProjectView={true}
          />

          {activeView === 'kanban' && (
            <DragDropContext onDragEnd={onDragEnd}>
              <TaskKanbanView kanbanTasks={kanbanTasks} />
            </DragDropContext>
          )}
          {/* {activeView === 'table' && (
            <TaskTableView
              paginatedTasks={paginatedTasks}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              handleDelete={handleDelete}
              hideProjectColumn={true}
            />
          )} */}
          {activeView === 'table' && (
  <TaskTableView
    filteredTasks={paginatedTasks} // Pass paginatedTasks as filteredTasks
    hideProjectColumn={true}
  />
)}
          {activeView === 'calendar' && <TaskCalendarView filteredTasks={filteredTasks} />}
        </motion.div>

        <NewTaskModal
          show={showTaskModal}
          setShowModal={setShowTaskModal}
          projectName={project.name}
        />
      </motion.div>
    </Container>
  );
};

export default ProjectDetails;
