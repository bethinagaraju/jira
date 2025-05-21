

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useTasks } from '../context/TaskContext';
import TaskFilters from '../components/TaskFilters';
import TaskKanbanView from '../components/TaskKanbanView';
import TaskTableView from '../components/TaskTableView';
import TaskCalendarView from '../components/TaskCalendarView';
import ViewToggle from '../components/ViewToggle';
import NewTaskModal from '../components/NewTaskModal';
import ProjectModal from '../components/ProjectModal';
import './Mytasks.css';
import DashboardStats from '../components/DashboardStats';

const MyTasks = () => {
  const { tasks, setTasks, deleteTask, teamMembers, projects, role, rolePermissions, userName } = useTasks();
  const [activeView, setActiveView] = useState('kanban');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    console.log('Tasks:----------------->', tasks);
    console.log('Team Members:', teamMembers);
    console.log('Projects:', projects);
    console.log('Role:', role);
    console.log('UserName:', userName);
    console.log('Role Permissions:', rolePermissions);
  }, [tasks, teamMembers, projects, role, userName, rolePermissions]);

  const displayedProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      console.warn('Projects is not an array:', projects);
      return [];
    }
    const filtered = role === 'admin' || role === 'hr'
      ? projects
      : projects.filter(project => {
          const isMember = project?.members?.includes(userName) || false;
          console.log(`Checking project ${project.name}: userName=${userName}, members=${project?.members}, isMember=${isMember}`);
          return isMember;
        });
    console.log('MyTasks - Displayed Projects:', filtered);
    return filtered;
  }, [projects, role, userName]);

  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const projectOptions = ['All', ...displayedProjects.map((project) => project.name)];
  const assigneeOptions = ['All', ...teamMembers.map((member) => member.name)];
  const statusOptions = ['All', 'Todo', 'In Progress', 'In Review', 'Done'];

  const filteredTasks = useMemo(() => {
    const projectNames = displayedProjects.map(project => project.name);
    console.log('MyTasks - Project Names for Filtering:', projectNames);

    // Ensure tasks is an array
    if (!Array.isArray(tasks)) {
      console.warn('Tasks is not an array:', tasks);
      return [];
    }

    const filtered = tasks
      .filter(task => {
        if (!task.project || task.project === '') {
          console.log(`Task ${task.id} has no project, including it:`, task);
          return true;
        }
        const matchesProject = projectNames.includes(task.project);
        console.log(`Task ${task.id} - Project: ${task.project}, Matches: ${matchesProject}, Task:`, task);
        return matchesProject;
      })
      .filter((task) => (selectedProject === 'All' ? true : task.project === selectedProject))
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

    console.log('MyTasks - Filtered Tasks (before passing to TaskTableView):', filtered);
    return filtered;
  }, [tasks, displayedProjects, selectedProject, selectedAssignee, selectedStatus, selectedDate, searchQuery]);

  useEffect(() => {
    console.log('MyTasks - Filtered Tasks (useEffect):', filteredTasks);
  }, [filteredTasks]);

  const [kanbanTasks, setKanbanTasks] = useState({});

  useEffect(() => {
    const grouped = (filteredTasks || []).reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push({
        id: task.id.toString(),
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleDateString(),
        assignee: task.assignee || '',
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
    console.log('MyTasks - Kanban Tasks:', grouped);
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

  const handleEdit = useCallback((task) => {
    setTaskToEdit(task);
    setShowTaskModal(true);
  }, []);

  const handleDelete = useCallback((taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  }, [deleteTask]);

  const canManageProjects = rolePermissions[role]?.canEditProjects || false;
  const canCreateTasks = rolePermissions[role]?.canCreateTasks || false;

  return (
    <Container fluid className="mytasks-wrapper mt-4">
      <Row className="align-items-center">
        <Col>
          <h1 className="text-2xl pb-0 m-0" style={{ color: 'rgba(82, 109, 130, 0.8)', fontFamily: 'Rubik, sans-serif', fontWeight: 600 }}>
            My Tasks
          </h1>
          <p className="text-sm pb-4" style={{ color: '#9DB2BF' }}>
            View all of your tasks here
          </p>
        </Col>
        <Col xs="auto d-flex">
          {canCreateTasks && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowTaskModal(true)}
              className="d-flex align-items-center rounded-md me-2"
            >
              <BsPlus size={16} className="me-1" /> New Task
            </Button>
          )}
          {canManageProjects && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowProjectModal(true)}
              className="d-flex align-items-center rounded-md"
            >
              <BsPlus size={16} className="me-1" /> New Project
            </Button>
          )}
        </Col>
      </Row>

      <DashboardStats />

      <Row className="mb-4 align-items-center">
        <ViewToggle activeView={activeView} setActiveView={setActiveView} />
      </Row>

      <TaskFilters
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedAssignee={selectedAssignee}
        setSelectedAssignee={setSelectedAssignee}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projectOptions={projectOptions}
        assigneeOptions={assigneeOptions}
        statusOptions={statusOptions}
      />

      {activeView === 'kanban' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskKanbanView kanbanTasks={kanbanTasks} />
        </DragDropContext>
      )}
      {activeView === 'table' && (
        <TaskTableView
          filteredTasks={filteredTasks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          hideProjectColumn={selectedProject !== 'All'}
        />
      )}
      {activeView === 'calendar' && <TaskCalendarView filteredTasks={filteredTasks} />}

      <NewTaskModal
        show={showTaskModal}
        setShowModal={setShowTaskModal}
        taskToEdit={taskToEdit}
        onSave={() => setTaskToEdit(null)}
      />
      <ProjectModal show={showProjectModal} setShowModal={setShowProjectModal} />
    </Container>
  );
};

export default MyTasks;