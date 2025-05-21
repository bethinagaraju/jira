import React from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { useTasks } from '../context/TaskContext';
import './PermissionsManagement.css';

const PermissionsManagement = () => {
  const { role, rolePermissions, togglePermission, resetRolePermissions } = useTasks();

  if (role !== 'admin') {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          Access Denied: Only admins can manage permissions.
        </Alert>
      </Container>
    );
  }

  if (!togglePermission) {
    console.error('PermissionsManagement: togglePermission is undefined');
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          Error: Permission toggling functionality is unavailable.
        </Alert>
      </Container>
    );
  }

  const permissionKeys = Object.keys(rolePermissions.teammember || {});
  const roles = Object.keys(rolePermissions || {});

  const handlePermissionChange = (roleName, permissionKey) => {
    console.log(`PermissionsManagement: Toggling ${roleName}.${permissionKey}`); 
    togglePermission(roleName, permissionKey);
  };

  const handleReset = () => {
    console.log('PermissionsManagement: Resetting permissions to default'); 
    resetRolePermissions();
  };

  return (
    <Container className="permissions-management mt-4">
      <h2 className="mb-4" style={{ fontWeight: 600, color: '#526D82' }}>
        Manage Role Permissions
      </h2>
      <Button
        variant="danger"
        size="sm"
        onClick={handleReset}
        className="mb-4 d-flex align-items-center"
      >
        <BsArrowCounterclockwise className="me-2" />
        Reset Permissions to Default
      </Button>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead style={{ backgroundColor: '#F8F9FA' }}>
          <tr>
            <th className="text-muted text-uppercase small">Permission</th>
            {roles.map((roleName) => (
              <th key={roleName} className="text-muted text-uppercase small text-center">
                {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionKeys.map((permissionKey) => (
            <tr key={permissionKey}>
              <td className="fw-medium align-middle">
                {permissionKey.replace(/can/g, '').replace(/([A-Z])/g, ' $1').trim()}
              </td>
              {roles.map((roleName) => (
                <td key={`${roleName}-${permissionKey}`} className="text-center align-middle">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={rolePermissions[roleName]?.[permissionKey] ?? false}
                      onChange={() => handlePermissionChange(roleName, permissionKey)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PermissionsManagement;