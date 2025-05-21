import React from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import PropTypes from 'prop-types';
import './TaskCalendarView.css'; 

const TaskCalendarView = ({ filteredTasks }) => {
  
  const statusColors = {
    Todo: { background: '#FFF0F0', border: '#FF6B6B', text: '#CC0000' },
    'In Progress': { background: '#F0F7FF', border: '#4D96FF', text: '#003D99' },
    'In Review': { background: '#FFF8F0', border: '#FFB347', text: '#CC7000' },
    Done: { background: '#F0FFF4', border: '#77DD77', text: '#008000' },
  };


  const events = filteredTasks.map((task) => {
    const colors = statusColors[task.status] || statusColors['Todo'];
    return {
      id: task.id,
      title: task.title,
      date: task.dueDate,
      backgroundColor: colors.background,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        assignee: task.assignee,
        project: task.project,
        status: task.status,
        description: task.description || '',
      },
    };
  });

  
  const initialDate = filteredTasks.length
    ? filteredTasks.reduce((earliest, task) =>
        !earliest || new Date(task.dueDate) < new Date(earliest.dueDate) ? task : earliest
      ).dueDate
    : new Date().toISOString().split('T')[0];

  const renderEventContent = (eventInfo) => (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip className="calendar-tooltip">
          <div className="tooltip-header">
            <strong>{eventInfo.event.title}</strong>
            <span className={`status-badge ${eventInfo.event.extendedProps.status.replace(/\s+/g, '-').toLowerCase()}`}>
              {eventInfo.event.extendedProps.status}
            </span>
          </div>
          <div className="tooltip-content">
            {eventInfo.event.extendedProps.description && (
              <p className="tooltip-description">{eventInfo.event.extendedProps.description}</p>
            )}
            <div className="tooltip-meta">
              <span className="meta-item">
                <i className="bi bi-person-fill"></i> {eventInfo.event.extendedProps.assignee || 'Unassigned'}
              </span>
              <span className="meta-item">
                <i className="bi bi-folder-fill"></i> {eventInfo.event.extendedProps.project || 'No project'}
              </span>
            </div>
          </div>
        </Tooltip>
      }
    >
      <div className="fc-event-content">
        <div className="fc-event-title">{eventInfo.event.title}</div>
        <div className="fc-event-status">{eventInfo.event.extendedProps.status}</div>
      </div>
    </OverlayTrigger>
  );

  return (
    <Container fluid className="task-calendar-view px-0">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={initialDate}
          events={events}
          height="auto"
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'prev,next today dayGridMonth',
          }}
          eventDisplay="block"
          eventContent={renderEventContent}
          dayHeaderClassNames="calendar-day-header"
          dayCellClassNames="calendar-day-cell"
          eventClassNames="calendar-event"
          buttonText={{
            today: 'Today',
            month: 'Month',
          }}
          aria-label="Task calendar"
          navLinks={true}
          dayMaxEvents={3}
          moreLinkContent={(args) => {
            return (
              <span className="more-link">
                +{args.num} more
              </span>
            );
          }}
        />
      </div>
    </Container>
  );
};

TaskCalendarView.propTypes = {
  filteredTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      status: PropTypes.string,
      assignee: PropTypes.string,
      project: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default TaskCalendarView;