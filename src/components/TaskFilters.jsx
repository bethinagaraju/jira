
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Dropdown } from 'react-bootstrap';
import { BsSearch, BsChevronDown } from 'react-icons/bs';

const TaskFilters = ({
  selectedProject,
  setSelectedProject,
  selectedAssignee,
  setSelectedAssignee,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  searchQuery,
  setSearchQuery,
  projectOptions,
  assigneeOptions,
  statusOptions,
  isProjectView,
}) => {
  const [placeholder, setPlaceholder] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const words = ['Charles', 'Jira', 'Home Page', 'In Progress'];

  useEffect(() => {
    if (searchQuery.length > 0) {
      setPlaceholder('');
      return;
    }

    const currentWord = words[currentWordIndex];
    let timeout;

    if (isTyping) {
      if (currentCharIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentWord.slice(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        }, 200); 
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
          setCurrentCharIndex(currentCharIndex - 1);
        }, 1000); 
      }
    } else {
      
      if (currentCharIndex >= 0) {
        timeout = setTimeout(() => {
          setPlaceholder(currentWord.slice(0, currentCharIndex));
          setCurrentCharIndex(currentCharIndex - 1);
        }, 150); 
      } else {
      
        timeout = setTimeout(() => {
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
          setCurrentCharIndex(0);
          setIsTyping(true);
        }, 500); 
      }
    }

    return () => clearTimeout(timeout);
  }, [searchQuery, currentCharIndex, isTyping, currentWordIndex, words]);

  return (
    <Row className="mb-4">
      <Col xs="auto">
        <div className="position-relative">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center"
            >
              {selectedStatus} <BsChevronDown className="ms-1" size={14} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {statusOptions.map((status) => (
                <Dropdown.Item
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  active={selectedStatus === status}
                >
                  {status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Col>
      <Col xs="auto">
        <div className="position-relative">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center"
            >
              {selectedAssignee} <BsChevronDown className="ms-1" size={14} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {assigneeOptions.map((assignee) => (
                <Dropdown.Item
                  key={assignee}
                  onClick={() => setSelectedAssignee(assignee)}
                  active={selectedAssignee === assignee}
                >
                  {assignee}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Col>
      {!isProjectView && (
        <Col xs="auto">
          <Form.Select
            size="sm"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border rounded-md text-sm text-gray-700"
          >
            {projectOptions.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </Form.Select>
        </Col>
      )}
      <Col xs="auto">
        <div className="position-relative">
          <Form.Control
            type="date"
            size="sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md text-sm text-gray-700"
            style={{ padding: '0 0.5rem' }}
          />
        </div>
      </Col>
      <Col xs="auto">
        <div className="d-flex align-items-center border rounded-md px-3 py-1">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 shadow-none text-sm text-gray-500"
            placeholder={placeholder || 'Search'}
            style={{ padding: '0 0.5rem', boxShadow: 'none' }}
          />
          <BsSearch className="text-primary" size={16} />
        </div>
      </Col>
    </Row>
  );
};

export default TaskFilters;