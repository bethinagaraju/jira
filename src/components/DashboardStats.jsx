import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTasks } from '../context/TaskContext';
import { BsFolder, BsListTask, BsGear, BsCheckCircle, BsClock } from 'react-icons/bs';

const DashboardStats = () => {
  const { tasks, projects, userName, role } = useTasks();
  const displayedProjects = role === 'admin' || role === 'hr'
    ? projects
    : projects.filter(project => project.members.includes(userName));

  const filteredTasks = tasks.filter(task =>
    displayedProjects.some(project => project.name === task.project)
  );

  const totalProjects = displayedProjects.length;
  const totalTasks = filteredTasks.length;
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'In Progress').length;
  const completedTasks = filteredTasks.filter((task) => task.status === 'Done').length;
  const overdueTasks = filteredTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date('2025-05-06');
    return dueDate < today && task.status !== 'Done';
  }).length;

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: <BsFolder size={24} />,
      color: 'rgba(187, 132, 147, 0.8)',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: <BsListTask size={24} />,
      color: 'rgba(105, 117, 101, 0.7)',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: <BsGear size={24} />,
      color: 'rgba(30, 95, 116, 0.7)',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: <BsCheckCircle size={24} />,
      color: '#BED7DC', 
    },
    {
      label: 'Overdue Tasks',
      value: overdueTasks,
      icon: <BsClock size={24} />,
      color: '#BBAB8C', 
    },
  ];

  return (
    <Row className="g-4 p-2 pb-4">
      {stats.map((stat, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-center align-items-center">
                <div className="mb-2 me-3" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <Card.Title as="h6" className="text-muted fw-semibold">
                  <span style={{ fontSize: '18px', color: 'rgba(128, 128, 128, 0.8)' }}>{stat.label}</span>
                </Card.Title>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span className="display-6 fw-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;