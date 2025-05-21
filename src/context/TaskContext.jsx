
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const generateId = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

// const TaskContext = createContext();

// const initialData = {
//   tasks: [
//     // { id: 1, title: 'Implement offline mode', status: 'Todo', assignee: 'John Doe', dueDate: '2024-10-14', project: 'Website Redesign' },
//     // { id: 2, title: 'Develop login screen', status: 'In Review', assignee: 'Jane Smith', dueDate: '2024-10-12', project: 'Mobile App' },
//     // { id: 3, title: 'Create sitemap', status: 'Done', assignee: 'Alice Johnson', dueDate: '2024-10-02', project: 'Website Redesign' },
//     // { id: 4, title: 'Design new homepage', status: 'In Progress', assignee: 'Bob Williams', dueDate: '2024-10-03', project: 'Website Redesign' },
//   ],
//   projects: [
//     // {
//     //   id: 'proj-1',
//     //   name: 'Mobile App',
//     //   short: 'M',
//     //   color: '#007bff',
//     //   members: ['John Doe', 'Jane Smith'],
//     //   description: 'Developing a cross-platform mobile application',
//     //   startDate: '2024-09-01',
//     //   deadline: '2024-12-31',
//     // },
//     // {
//     //   id: 'proj-2',
//     //   name: 'Website Redesign',
//     //   short: 'W',
//     //   color: '#6f42c1',
//     //   members: ['Alice Johnson', 'Bob Williams'],
//     //   description: 'Revamping the company website for better UX',
//     //   startDate: '2024-08-15',
//     //   deadline: '2024-11-30',
//     // },
//   ],
//   teamMembers: [
//     { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', initials: 'JD', isYou: true, avatar: '/user1.jpg' },
//     // { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'teammember', initials: 'JS', isYou: false, avatar: '/user2.jpg' },
//     // { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'teammember', initials: 'AJ', isYou: false, avatar: '/user3.jpg' },
//     // { id: 4, name: 'Bob Williams', email: 'bob.williams@example.com', role: 'teammember', initials: 'BW', isYou: false, avatar: '/user4.jpg' },
//     // { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'teammember', initials: 'CB', isYou: false, avatar: '/user5.jpg' },
//     // { id: 6, name: 'David Lee', email: 'david.lee@example.com', role: 'teammember', initials: 'DL', isYou: false, avatar: '/user6.jpg' },
//     // { id: 7, name: 'Eva Martin', email: 'eva.martin@example.com', role: 'teammember', initials: 'EM', isYou: false, avatar: '/user7.jpg' },
//     // { id: 8, name: 'Frank Thompson', email: 'admin@example.com', role: 'admin', initials: 'FT', isYou: false, avatar: '/user8.jpg' },
//   ],
//   rolePermissions: {
//     teammember: {
//       canViewTasks: true,
//       canCreateTasks: false,
//       canAssignTasks: false,
//       canEditProjects: false,
//       canManageUsers: false,
//       canChangeStatus: false,
//       canChangeDueDate: false,
//       canChangeAssignee: false,
//       canChangeProjectName: false,
//       canChangeTaskName: false,
//     },
//     teamlead: {
//       canViewTasks: true,
//       canCreateTasks: true,
//       canAssignTasks: true,
//       canEditProjects: false,
//       canManageUsers: false,
//       canChangeDueDate: true,
//       canChangeAssignee: true,
//       canChangeProjectName: true,
//       canChangeTaskName: true,
//     },
//     projectmanager: {
//       canViewTasks: true,
//       canCreateTasks: true,
//       canAssignTasks: true,
//       canEditProjects: true,
//       canManageUsers: false,
//       canChangeDueDate: true,
//       canChangeAssignee: true,
//       canChangeProjectName: true,
//       canChangeTaskName: true,
//     },
//     admin: {
//       canViewTasks: true,
//       canCreateTasks: true,
//       canAssignTasks: true,
//       canEditProjects: true,
//       canManageUsers: true,
//       canAccessHR: true,
//       canChangeDueDate: true,
//       canChangeAssignee: true,
//       canChangeProjectName: true,
//       canChangeTaskName: true,
//     },
//     hr: {
//       canViewTasks: true,
//       canAccessHR: true,
//       canManageUsers: true,
//       canChangeDueDate: true,
//       canChangeAssignee: true,
//       canChangeProjectName: true,
//       canChangeTaskName: true,
//       canCreateTasks: true,
//     },
//   },
// };

// const loadFromLocalStorage = (key, defaultValue) => {
//   try {
//     const storedData = localStorage.getItem(key);
//     const parsedData = storedData ? JSON.parse(storedData) : defaultValue;
//     console.log(`Loaded ${key} from localStorage:`, parsedData);
//     return parsedData;
//   } catch (error) {
//     console.error(`Error loading ${key} from localStorage:`, error);
//     return defaultValue;
//   }
// };

// const saveToLocalStorage = (key, value) => {
//   try {
//     const serializedValue = JSON.stringify(value);
//     localStorage.setItem(key, serializedValue);
//     console.log(`Successfully saved ${key} to localStorage:`, value);
//   } catch (error) {
//     console.error(`Error saving ${key} to localStorage:`, error);
//   }
// };

// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState(() => loadFromLocalStorage('tasks', initialData.tasks));
//   const [projects, setProjects] = useState(() => loadFromLocalStorage('projects', initialData.projects));
//   const [teamMembers, setTeamMembers] = useState(() => loadFromLocalStorage('teamMembers', initialData.teamMembers));
//   const [role, setRole] = useState(() => loadFromLocalStorage('role', 'admin')); 
//   const [userName, setUserName] = useState(() => loadFromLocalStorage('userName', 'John Doe')); 
//   const [userAvatar, setUserAvatar] = useState(() => loadFromLocalStorage('userAvatar', '/user1.jpg'));
//   const [rolePermissions, setRolePermissions] = useState(() => loadFromLocalStorage('rolePermissions', initialData.rolePermissions));

//   useEffect(() => {
//     saveToLocalStorage('tasks', tasks);
//   }, [tasks]);

//   useEffect(() => {
//     saveToLocalStorage('projects', projects);
//   }, [projects]);

//   useEffect(() => {
//     saveToLocalStorage('teamMembers', teamMembers);
//   }, [teamMembers]);

//   useEffect(() => {
//     saveToLocalStorage('role', role);
//   }, [role]);

//   useEffect(() => {
//     saveToLocalStorage('userName', userName);
//   }, [userName]);

//   useEffect(() => {
//     saveToLocalStorage('userAvatar', userAvatar);
//   }, [userAvatar]);

//   useEffect(() => {
//     saveToLocalStorage('rolePermissions', rolePermissions);
//     console.log('RolePermissions updated:', rolePermissions); 
//   }, [rolePermissions]);

//   const updateRolePermissions = (roleName, permissionKey, value) => {
//     console.log(`Updating permission: ${roleName}.${permissionKey} = ${value}`); 
//     setRolePermissions(prevPermissions => {
//       const newPermissions = {
//         ...prevPermissions,
//         [roleName]: {
//           ...prevPermissions[roleName],
//           [permissionKey]: value,
//         },
//       };
//       console.log('New permissions state:', newPermissions); 
//       return newPermissions;
//     });
//   };

//   const togglePermission = (roleName, permissionKey) => {
//     console.log(`Toggling permission: ${roleName}.${permissionKey}`); 
//     setRolePermissions(prevPermissions => {
//       const newPermissions = {
//         ...prevPermissions,
//         [roleName]: {
//           ...prevPermissions[roleName],
//           [permissionKey]: !prevPermissions[roleName][permissionKey],
//         },
//       };
//       console.log('New permissions state after toggle:', newPermissions); 
//       return newPermissions;
//     });
//   };

//   const resetRolePermissions = () => {
//     console.log('Resetting role permissions to default');
//     setRolePermissions(initialData.rolePermissions);
//   };

//   const addTask = (task) => {
//     if (!task.title?.trim()) {
//       throw new Error('Task title is required');
//     }
//     if (!task.status) {
//       throw new Error('Task status is required');
//     }
//     if (!task.dueDate) {
//       throw new Error('Due date is required');
//     }

//     const newTask = {
//       id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
//       title: task.title,
//       status: task.status,
//       assignee: task.assignee || '',
//       dueDate: task.dueDate,
//       project: task.project || '',
//     };
//     setTasks(prev => [...prev, newTask]);
//   };

//   const editTask = (updatedTask) => {
//     setTasks(prevTasks =>
//       prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
//     );
//   };

//   const deleteTask = (taskId) => {
//     setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
//   };

//   const addProject = (project) => {
//     if (!project.name?.trim()) {
//       throw new Error('Project name is required');
//     }
//     if (!project.members?.length) {
//       throw new Error('At least one member is required');
//     }
//     if (!project.startDate) {
//       throw new Error('Start date is required');
//     }
//     if (!project.deadline) {
//       throw new Error('Deadline is required');
//     }

//     const short = project.name.trim().charAt(0).toUpperCase();
//     const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
//     const newProject = {
//       id: generateId(),
//       name: project.name,
//       short,
//       color,
//       members: project.members,
//       description: project.description || '',
//       startDate: project.startDate,
//       deadline: project.deadline,
//     };
//     setProjects(prev => [...prev, newProject]);
//   };

//   const editProject = (projectId, updatedProject) => {
//     setProjects(prevProjects => {
//       const newProjects = prevProjects.map(project => {
//         if (project.id === projectId) {
//           const short = updatedProject.name.trim().charAt(0).toUpperCase();
//           const color = project.name !== updatedProject.name
//             ? '#' + Math.floor(Math.random() * 16777215).toString(16)
//             : project.color;
//           return {
//             ...updatedProject,
//             short,
//             color,
//           };
//         }
//         return project;
//       });
//       console.log('Updated projects state:', newProjects);
//       return [...newProjects];
//     });
//   };

//   const deleteProject = (projectId) => {
//     setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
//     setTasks(prevTasks =>
//       prevTasks.map(task =>
//         task.project === projects.find(p => p.id === projectId)?.name
//           ? { ...task, project: '' }
//           : task
//       )
//     );
//   };

//   const addTeamMember = (member) => {
//     const initials = member.name.split(' ').map(word => word[0]).join('').toUpperCase();
//     const newMember = {
//       id: generateId(),
//       ...member,
//       initials,
//       isYou: false,
//       avatar: `/user${Math.floor(Math.random() * 7) + 1}.jpg`,
//     };
//     setTeamMembers(prev => [...prev, newMember]);
//   };

//   const editTeamMember = (updatedMember) => {
//     const initials = updatedMember.name.split(' ').map(word => word[0]).join('').toUpperCase();
//     setTeamMembers(prevMembers =>
//       prevMembers.map(member =>
//         member.id === updatedMember.id ? { ...updatedMember, initials } : member
//       )
//     );
//   };

//   const removeTeamMember = (memberId) => {
//     setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
//     setTasks(prevTasks =>
//       prevTasks.map(task =>
//         task.assignee === teamMembers.find(m => m.id === memberId)?.name
//           ? { ...task, assignee: '' }
//           : task
//       )
//     );
//     setProjects(prevProjects =>
//       prevProjects.map(project => ({
//         ...project,
//         members: project.members.filter(
//           member => member !== teamMembers.find(m => m.id === memberId)?.name
//         ),
//       }))
//     );
//   };

//   return (
//     <TaskContext.Provider
//       value={{
//         tasks,
//         setTasks,
//         addTask,
//         editTask,
//         deleteTask,
//         projects,
//         addProject,
//         editProject,
//         deleteProject,
//         teamMembers,
//         addTeamMember,
//         editTeamMember,
//         removeTeamMember,
//         role,
//         setRole,
//         rolePermissions,
//         updateRolePermissions,
//         togglePermission,
//         resetRolePermissions,
//         userName,
//         setUserName,
//         userAvatar,
//         setUserAvatar,
//       }}
//     >
//       {children}
//     </TaskContext.Provider>
//   );
// };

// export const useTasks = () => useContext(TaskContext);






import React, { createContext, useContext, useState, useEffect } from 'react';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const TaskContext = createContext();

const initialData = {
  tasks: [
    { id: 1, title: 'Implement offline mode', status: 'Todo', assignee: 'John Doe', dueDate: '2024-10-14', project: 'Website Redesign', description: '', workType: 'Task', reporter: 'Alice Johnson', labels: [], parent: '', team: 'Website Redesign', linkedWorkItems: { blocks: '', blockedBy: '' }, attachments: [] },
    { id: 2, title: 'Develop login screen', status: 'In Review', assignee: 'Jane Smith', dueDate: '2024-10-12', project: 'Mobile App', description: '', workType: 'Task', reporter: 'John Doe', labels: ['Urgent'], parent: '', team: 'Mobile App', linkedWorkItems: { blocks: '', blockedBy: '' }, attachments: [] },
    { id: 3, title: 'Create sitemap', status: 'Done', assignee: 'Alice Johnson', dueDate: '2024-10-02', project: 'Website Redesign', description: '', workType: 'Task', reporter: 'Bob Williams', labels: [], parent: '', team: 'Website Redesign', linkedWorkItems: { blocks: '', blockedBy: '' }, attachments: [] },
    { id: 4, title: 'Design new homepage', status: 'In Progress', assignee: 'Bob Williams', dueDate: '2024-10-03', project: 'Website Redesign', description: '', workType: 'Task', reporter: 'John Doe', labels: ['Feature'], parent: '', team: 'Website Redesign', linkedWorkItems: { blocks: '', blockedBy: '' }, attachments: [] },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Mobile App',
      short: 'M',
      color: '#007bff',
      members: ['John Doe', 'Jane Smith'],
      description: 'Developing a cross-platform mobile application',
      startDate: '2024-09-01',
      deadline: '2024-12-31',
    },
    {
      id: 'proj-2',
      name: 'Website Redesign',
      short: 'W',
      color: '#6f42c1',
      members: ['Alice Johnson', 'Bob Williams', 'John Doe'],
      description: 'Revamping the company website for better UX',
      startDate: '2024-08-15',
      deadline: '2024-11-30',
    },
  ],
  teamMembers: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', initials: 'JD', isYou: true, avatar: '/user1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'teammember', initials: 'JS', isYou: false, avatar: '/user2.jpg' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'teammember', initials: 'AJ', isYou: false, avatar: '/user3.jpg' },
    { id: 4, name: 'Bob Williams', email: 'bob.williams@example.com', role: 'teammember', initials: 'BW', isYou: false, avatar: '/user4.jpg' },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'teammember', initials: 'CB', isYou: false, avatar: '/user5.jpg' },
    { id: 6, name: 'David Lee', email: 'david.lee@example.com', role: 'teammember', initials: 'DL', isYou: false, avatar: '/user6.jpg' },
    { id: 7, name: 'Eva Martin', email: 'eva.martin@example.com', role: 'teammember', initials: 'EM', isYou: false, avatar: '/user7.jpg' },
    { id: 8, name: 'Frank Thompson', email: 'admin@example.com', role: 'admin', initials: 'FT', isYou: false, avatar: '/user8.jpg' },
  ],
  rolePermissions: {
    teammember: {
      canViewTasks: true,
      canCreateTasks: false,
      canAssignTasks: false,
      canEditProjects: false,
      canManageUsers: false,
      canChangeStatus: false,
      canChangeDueDate: false,
      canChangeAssignee: false,
      canChangeProjectName: false,
      canChangeTaskName: false,
    },
    teamlead: {
      canViewTasks: true,
      canCreateTasks: true,
      canAssignTasks: true,
      canEditProjects: false,
      canManageUsers: false,
      canChangeDueDate: true,
      canChangeAssignee: true,
      canChangeProjectName: true,
      canChangeTaskName: true,
    },
    projectmanager: {
      canViewTasks: true,
      canCreateTasks: true,
      canAssignTasks: true,
      canEditProjects: true,
      canManageUsers: false,
      canChangeDueDate: true,
      canChangeAssignee: true,
      canChangeProjectName: true,
      canChangeTaskName: true,
    },
    admin: {
      canViewTasks: true,
      canCreateTasks: true,
      canAssignTasks: true,
      canEditProjects: true,
      canManageUsers: true,
      canAccessHR: true,
      canChangeDueDate: true,
      canChangeAssignee: true,
      canChangeProjectName: true,
      canChangeTaskName: true,
    },
    hr: {
      canViewTasks: true,
      canAccessHR: true,
      canManageUsers: true,
      canChangeDueDate: true,
      canChangeAssignee: true,
      canChangeProjectName: true,
      canChangeTaskName: true,
      canCreateTasks: true,
    },
  },
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(key);
    const parsedData = storedData ? JSON.parse(storedData) : defaultValue;
    console.log(`Loaded ${key} from localStorage:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    console.log(`Successfully saved ${key} to localStorage:`, value);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => loadFromLocalStorage('tasks', initialData.tasks));
  const [projects, setProjects] = useState(() => loadFromLocalStorage('projects', initialData.projects));
  const [teamMembers, setTeamMembers] = useState(() => loadFromLocalStorage('teamMembers', initialData.teamMembers));
  const [role, setRole] = useState(() => loadFromLocalStorage('role', 'admin')); 
  const [userName, setUserName] = useState(() => loadFromLocalStorage('userName', 'John Doe')); 
  const [userAvatar, setUserAvatar] = useState(() => loadFromLocalStorage('userAvatar', '/user1.jpg'));
  const [rolePermissions, setRolePermissions] = useState(() => loadFromLocalStorage('rolePermissions', initialData.rolePermissions));

  useEffect(() => {
    // Sanitize tasks before saving to local storage by converting file objects to metadata
    const sanitizedTasks = tasks.map(task => ({
      ...task,
      attachments: Array.isArray(task.attachments) ? task.attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })) : [],
    }));
    saveToLocalStorage('tasks', sanitizedTasks);
  }, [tasks]);

  useEffect(() => {
    saveToLocalStorage('projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToLocalStorage('teamMembers', teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    saveToLocalStorage('role', role);
  }, [role]);

  useEffect(() => {
    saveToLocalStorage('userName', userName);
  }, [userName]);

  useEffect(() => {
    saveToLocalStorage('userAvatar', userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    saveToLocalStorage('rolePermissions', rolePermissions);
    console.log('RolePermissions updated:', rolePermissions); 
  }, [rolePermissions]);

  const updateRolePermissions = (roleName, permissionKey, value) => {
    console.log(`Updating permission: ${roleName}.${permissionKey} = ${value}`); 
    setRolePermissions(prevPermissions => {
      const newPermissions = {
        ...prevPermissions,
        [roleName]: {
          ...prevPermissions[roleName],
          [permissionKey]: value,
        },
      };
      console.log('New permissions state:', newPermissions); 
      return newPermissions;
    });
  };

  const togglePermission = (roleName, permissionKey) => {
    console.log(`Toggling permission: ${roleName}.${permissionKey}`); 
    setRolePermissions(prevPermissions => {
      const newPermissions = {
        ...prevPermissions,
        [roleName]: {
          ...prevPermissions[roleName],
          [permissionKey]: !prevPermissions[roleName][permissionKey],
        },
      };
      console.log('New permissions state after toggle:', newPermissions); 
      return newPermissions;
    });
  };

  const resetRolePermissions = () => {
    console.log('Resetting role permissions to default');
    setRolePermissions(initialData.rolePermissions);
  };

  const addTask = (task) => {
    console.log('Attempting to add task:', task);
    if (!task.title?.trim()) {
      throw new Error('Task title is required');
    }
    if (!task.status) {
      throw new Error('Task status is required');
    }
    if (!task.dueDate) {
      throw new Error('Due date is required');
    }
    if (!task.project?.trim()) {
      throw new Error('Project is required');
    }
    if (!task.workType?.trim()) {
      throw new Error('Work type is required');
    }
    if (!task.reporter?.trim()) {
      throw new Error('Reporter is required');
    }
    if (!rolePermissions[role]?.canCreateTasks) {
      throw new Error('You do not have permission to create tasks');
    }

    const newTask = {
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title: task.title,
      status: task.status,
      assignee: task.assignee || '',
      dueDate: task.dueDate,
      project: task.project || '',
      description: task.description || '',
      workType: task.workType || 'Task',
      reporter: task.reporter || '',
      labels: task.labels || [],
      parent: task.parent || '',
      team: task.team || '',
      linkedWorkItems: task.linkedWorkItems || { blocks: '', blockedBy: '' },
      attachments: task.attachments || [],
    };
    console.log('Adding new task:', newTask);
    setTasks(prev => {
      const updatedTasks = [...prev, newTask];
      console.log('Updated tasks state:', updatedTasks);
      return updatedTasks;
    });
  };

  const editTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addProject = (project) => {
    if (!project.name?.trim()) {
      throw new Error('Project name is required');
    }
    if (!project.members?.length) {
      throw new Error('At least one member is required');
    }
    if (!project.startDate) {
      throw new Error('Start date is required');
    }
    if (!project.deadline) {
      throw new Error('Deadline is required');
    }

    const short = project.name.trim().charAt(0).toUpperCase();
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const newProject = {
      id: generateId(),
      name: project.name,
      short,
      color,
      members: project.members,
      description: project.description || '',
      startDate: project.startDate,
      deadline: project.deadline,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const editProject = (projectId, updatedProject) => {
    setProjects(prevProjects => {
      const newProjects = prevProjects.map(project => {
        if (project.id === projectId) {
          const short = updatedProject.name.trim().charAt(0).toUpperCase();
          const color = project.name !== updatedProject.name
            ? '#' + Math.floor(Math.random() * 16777215).toString(16)
            : project.color;
          return {
            ...updatedProject,
            short,
            color,
          };
        }
        return project;
      });
      console.log('Updated projects state:', newProjects);
      return [...newProjects];
    });
  };

  const deleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.project === projects.find(p => p.id === projectId)?.name
          ? { ...task, project: '' }
          : task
      )
    );
  };

  const addTeamMember = (member) => {
    const initials = member.name.split(' ').map(word => word[0]).join('').toUpperCase();
    const newMember = {
      id: generateId(),
      ...member,
      initials,
      isYou: false,
      avatar: `/user${Math.floor(Math.random() * 7) + 1}.jpg`,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const editTeamMember = (updatedMember) => {
    const initials = updatedMember.name.split(' ').map(word => word[0]).join('').toUpperCase();
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === updatedMember.id ? { ...updatedMember, initials } : member
      )
    );
  };

  const removeTeamMember = (memberId) => {
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.assignee === teamMembers.find(m => m.id === memberId)?.name
          ? { ...task, assignee: '' }
          : task
      )
    );
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        members: project.members.filter(
          member => member !== teamMembers.find(m => m.id === memberId)?.name
        ),
      }))
    );
  };

  const canCreateTasks = () => {
    const canCreate = rolePermissions[role]?.canCreateTasks || false;
    console.log(`Checking canCreateTasks for role ${role}:`, canCreate);
    return canCreate;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        editTask,
        deleteTask,
        projects,
        addProject,
        editProject,
        deleteProject,
        teamMembers,
        addTeamMember,
        editTeamMember,
        removeTeamMember,
        role,
        setRole,
        rolePermissions,
        updateRolePermissions,
        togglePermission,
        resetRolePermissions,
        userName,
        setUserName,
        userAvatar,
        setUserAvatar,
        canCreateTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);