import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Row, Col, Badge } from 'react-bootstrap';
import { useTasks } from '../context/TaskContext';

const TaskKanbanView = ({ kanbanTasks }) => {
  const { projects } = useTasks();

  const statusBackgroundColors = {
    'Todo': '#ffffff', 
    'In Progress': '#ffffff', 
    'In Review': '#ffffff', 
    'Done': '#ffffff', 
  };
  const columnBackgroundColors = {
    'Todo': '#B3EBF2',
    'In Progress': 'rgba(133, 209, 219, 0.6)',
    'In Review': '#B6F2D1',
    'Done': '#C9FDF2',
  };

  const getProjectMembers = (projectName) => {
    const project = projects.find(p => p.name === projectName);
    return project ? project.members : [];
  };


  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Row className="mt-2 g-3">
      {['Todo', 'In Progress', 'In Review', 'Done'].map((status) => (
        <Col key={status} xs={12} sm={6} md={3}>
          <div
            className="border rounded p-3 h-100"
            style={{ backgroundColor: columnBackgroundColors[status] }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong
                className="text-sm font-medium text-gray-600"
                style={{
                  backgroundColor: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: 'rgba(112, 104, 104, 0.7)'
                  
                }}
              >
                {status}
              </strong>
              <Badge style={{ opacity: 0.9 }} bg="light" text="dark" className="border">
                {kanbanTasks[status]?.length || 0}
              </Badge>
            </div>
            <Droppable droppableId={status} isDropDisabled={false}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: '200px' }}
                >
                  {(kanbanTasks[status] || []).map((task, index) => {
                    const projectMembers = getProjectMembers(task.project);
                  const displayName = task.assignee && task.assignee.trim() !== '' ? task.assignee : 'Unassigned';
                  const initials = task.assignee && task.assignee.trim() !== '' ? getInitials(task.assignee) : 'U';
                  return (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 mb-2 border rounded bg-white shadow-sm"
                        >
                          <div className="text-sm text-gray-900">{task.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(task.dueDate)}</div>
                          <div className="d-flex align-items-center mt-2">
                            <div
                              className="me-2 d-flex justify-content-center align-items-center text-white"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                userSelect: 'none',
                                backgroundColor: 'rgba(118, 104, 104, 0.5)',
                              }}
                              title={displayName}
                            >
                              {initials}
                            </div>
                            <div className="text-sm text-gray-900">{displayName}</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default TaskKanbanView;
