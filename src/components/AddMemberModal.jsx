import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { useTasks } from '../context/TaskContext';

const AddMemberModal = ({ show, onClose, onSubmit, roleOptions, editingMember }) => {
  const { addTeamMember } = useTasks();
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [faceImage, setFaceImage] = useState('');

  useEffect(() => {
    if (editingMember) {
      setMemberData({
        name: editingMember.name,
        email: editingMember.email,
        role: editingMember.role,
        avatar: editingMember.avatar,
      });
      setFaceImage(editingMember.avatar);
    } else {
      setMemberData({ name: '', email: '', role: '', avatar: '' });
      const num = Math.floor(Math.random() * 7) + 1;
      setFaceImage(`/user${num}.jpg`);
    }
    setErrors({});
  }, [editingMember, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!memberData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!memberData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!memberData.role) {
      newErrors.role = 'Role is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const memberPayload = {
      name: memberData.name,
      email: memberData.email,
      role: memberData.role,
      avatar: faceImage,
    };

    if (editingMember) {
      onSubmit(memberPayload);
    } else {
      addTeamMember(memberPayload);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={memberData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Enter name"
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={memberData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Enter email"
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={memberData.role}
              onChange={handleChange}
              isInvalid={!!errors.role}
            >
              <option value="">Select a role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
          </Form.Group>

          <Row className="mt-4">
            <Col className="text-end">
              <Button
                variant="secondary"
                onClick={onClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingMember ? (
                  'Save Changes'
                ) : (
                  <>
                    <FaUserPlus size={16} className="me-1" /> Add Member
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMemberModal;