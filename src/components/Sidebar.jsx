

import React, { useState, useEffect } from 'react';
import { Nav, Button, ListGroup, Image } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaCog, FaUsers, FaPlus} from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { IoLogOut } from "react-icons/io5";
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import ProjectModal from './ProjectModal';
import ProductTour from './ProductTour';

const tourSteps = [
  {
    target: '.add-project-btn',
    content: 'Click here to create a new project for your workspace.',
    title: 'Add a New Project',
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: '.my-tasks-link',
    content: 'View and manage all your tasks in one place.',
    title: 'My Tasks',
    placement: 'right',
  },
  {
    target: '.members-link',
    content: 'See the list of team members and collaborate effectively.',
    title: 'Team Members',
    placement: 'right',
  },
];

const Sidebar = () => {
  const { projects, role, rolePermissions, userName, userAvatar } = useTasks();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [manageProjects, setManageProjects] = useState(false);

  useEffect(() => {
    setManageProjects(rolePermissions[role]?.canEditProjects);
    console.log('canManageProjects', manageProjects);
  }, [role, rolePermissions]);

  const displayedProjects = role === 'admin' || role === 'hr'
    ? projects
    : projects.filter(project => project.members.includes(userName));

  return (
    <div className="sidebar d-flex flex-column p-3 bg-white">
    
      <ProductTour steps={tourSteps} sessionKey="sidebarProductTour" />
      <div className="logo-container d-flex justify-content-center align-items-center mb-4">
        <Image src="jira.svg" alt="Logo" className="sidebar-logo-img" />
        <h1 className="sidebar-logo-text mb-0 p-2">JIRA</h1>
      </div>
      <div className="mb-2">
     
        <ListGroup className="mb-2">
          <ListGroup.Item className="user-profile d-flex align-items-center justify-content-between active">
            <span className="user-avatar-name d-flex align-items-center">
              <Image src={userAvatar} alt="User Avatar" className="user-avatar me-2" />
              {userName.toUpperCase()}
            </span>
            <Nav.Link as={Link} to="/" className="d-flex align-items-center text-dark py-2" >
              <IoLogOut style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }} />
            </Nav.Link>
          </ListGroup.Item>
        </ListGroup>

      </div>
      <Nav defaultActiveKey="/home" className="sidebar-nav flex-column mb-4">
        <Nav.Link as={Link} to="/" className="sidebar-nav-link d-flex align-items-center text-dark py-2">
          <FaHome className="sidebar-nav-icon sidebar-nav-icon-home me-3" />
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/mytasks" className="sidebar-nav-link d-flex align-items-center text-dark py-2 my-tasks-link">
          <FaClipboardList className="sidebar-nav-icon sidebar-nav-icon-tasks me-3" />
          My Tasks
        </Nav.Link>

        <Nav.Link as={Link} to="/manage-access" className="sidebar-nav-link d-flex align-items-center text-dark py-2">
          <FaCog className="sidebar-nav-icon sidebar-nav-icon-settings me-3" />
          Settings
        </Nav.Link>

        <Nav.Link as={Link} to="/teammembers" className="sidebar-nav-link d-flex align-items-center text-dark py-2 members-link">
          <FaUsers className="sidebar-nav-icon sidebar-nav-icon-members me-3" />
          Members
        </Nav.Link>
      </Nav>
      <div className="mt-auto">
        <div className="projects-header d-flex justify-content-between align-items-center text-muted small mb-3">
          <span>PROJECTS</span>
          {manageProjects && (
            <FaPlus size={18} className="add-project-btn" onClick={() => setShowProjectModal(true)} />
          )}
        </div>
        <ListGroup>
          {displayedProjects.map((project) => (
            <ListGroup.Item
              key={project.id}
              className="project-item d-flex align-items-center"
              as={Link}
              to={`/projects/${project.id}`}
            >
              <div
                className="project-avatar rounded-circle d-flex justify-content-center align-items-center me-3"
                style={{ backgroundColor: project.color }}
              >
                {project.short}
              </div>
              {project.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <ProjectModal show={showProjectModal} setShowModal={setShowProjectModal} />
    </div>
  );
};

export default Sidebar;