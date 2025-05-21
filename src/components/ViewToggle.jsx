import React from 'react';
import { Button, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ViewToggle = ({ activeView, setActiveView }) => {
  return (
    <Col>
      <div className="d-flex gap-2">
        <Button
          variant={activeView === 'table' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setActiveView('table')}
          className="rounded"
          aria-pressed={activeView === 'table'}
          aria-label="Switch to Table view"
        >
          Table
        </Button>
        <Button
          variant={activeView === 'kanban' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setActiveView('kanban')}
          className="rounded"
          aria-pressed={activeView === 'kanban'}
          aria-label="Switch to Kanban view"
        >
          Kanban
        </Button>
        <Button
          variant={activeView === 'calendar' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setActiveView('calendar')}
          className="rounded"
          aria-pressed={activeView === 'calendar'}
          aria-label="Switch to Calendar view"
        >
          Calendar
        </Button>
      </div>
    </Col>
  );
};

ViewToggle.propTypes = {
  activeView: PropTypes.oneOf(['table', 'kanban', 'calendar']).isRequired,
  setActiveView: PropTypes.func.isRequired,
};

export default ViewToggle;