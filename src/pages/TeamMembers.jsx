
import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { FaUserPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useTasks } from "../context/TaskContext";
import AddMemberModal from "../components/AddMemberModal";
import { useTransition, animated } from 'react-spring';

const TeamMembers = () => {
  const { teamMembers, removeTeamMember, editTeamMember,rolePermissions,role } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [displayedMembers, setDisplayedMembers] = useState(teamMembers);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const roleOptions = ['Member', 'Team Member', 'Team Lead', 'Project Manager', 'Admin', 'HR'];

  useEffect(() => {
    setDisplayedMembers(teamMembers);
    console.log("Updated teamMembers:", teamMembers);
  
  }, [teamMembers]);

  useEffect(() => {
    console.log("rolePermissions:", rolePermissions);
  }, []);


  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(null), 500);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const transitions = useTransition(displayedMembers, {
    keys: member => member.id,
    from: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: { duration: 300 },
  });

  const handleRemove = (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setDisplayedMembers(prev => prev.filter(member => member.id !== memberId));
      setTimeout(() => {
        removeTeamMember(memberId);
      }, 300);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingMember(null);
  };

  const handleModalSubmit = (memberData) => {
    if (editingMember) {
      const updatedMember = {
        ...editingMember,
        name: memberData.name.trim(),
        email: memberData.email.trim(),
        role: memberData.role,
      };
      console.log("Saving updated member:", updatedMember);
      editTeamMember(updatedMember);
      setSaveSuccess({ memberId: editingMember.id, field: 'role' });
    } else {
      
    }
    handleModalClose();
  };

 
  const [manageUsers, setManageUsers] = useState(false);

  useEffect(() => {
    console.log('--------------------------------->',role);
    console.log(rolePermissions[role]?.canAssignTasks); // true
    console.log('canManageUsers',rolePermissions[role]?.canManageUsers); // true
    setManageUsers(rolePermissions[role]?.canManageUsers);
    console.log('canManageUsers',manageUsers); // true

  },[role]);



  return (
    <div className="p-4 bg-light min-vh-100 vw-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold">Team Members</h3>
          <p style={{ color: "#087cfc" }}>Manage your team members and their access</p>
        </div>
        {manageUsers && (
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <FaUserPlus />
            Add Member
          </Button>
        )}
      </div>

      <div className="bg-white rounded shadow-sm p-3">
        <Table hover responsive>
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-end"></th>
            </tr>
          </thead>
          <tbody>
            {transitions((style, member) => (
              <animated.tr style={style} key={member.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={`${member.name}'s avatar`}
                      className="me-2"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    <div className="fw-semibold" style={{ color: "rgba(11,94,216,255)" }}>
                      {member.name}
                    </div>
                  </div>
                </td>
                <td>
                  <span>{member.email}</span>
                </td>
                <td className={saveSuccess?.memberId === member.id && saveSuccess?.field === 'role' ? 'bg-green-100' : ''}>
                  <span>{member.role}</span>
                </td>
                {manageUsers && (
                  <td className="text-end">
                    <FaEdit
                      style={{ cursor: "pointer", color: "#007bff", marginRight: "10px" }}
                      onClick={() => handleEdit(member)}
                      aria-label="Edit member"
                    />
                    <FaTrash
                      style={{ cursor: "pointer", color: "#dc3545" }}
                      onClick={() => handleRemove(member.id)}
                      aria-label="Remove member"
                    />
                  </td>
                )}
              </animated.tr>
            ))}
          </tbody>
        </Table>
      </div>

      <AddMemberModal
        show={showAddModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        roleOptions={roleOptions}
        editingMember={editingMember}
      />
    </div>
  );
};

export default TeamMembers;