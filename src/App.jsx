
import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Mytasks from './pages/Mytasks';
import TeamMembers from './pages/TeamMembers';
import ProjectDetails from './pages/ProjectDetails';
import './components/Sidebar.css';
import LoginForm from './pages/LoginForm';
import PermissionsManagement from './components/PermissionsManagement';


function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const isAuthPage = ['/login', '/loginform', '/'].includes(location.pathname);

  return (
    <TaskProvider>
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        width: '100vw',
        backgroundColor: isAuthPage ? 'rgba(201, 214, 255, 0.6)' : 'rgba(235, 232, 230, 0.3)',
        background: isAuthPage ? 'linear-gradient(to right, #e2e2e2, #c9d6ff)' : 'none'
      }}>
        
        {!isAuthPage && <Sidebar />}
        
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderLeft: isAuthPage ? 'none' : '1px solid #ddd',
            width: isAuthPage ? '100%' : 'calc(100vw - 280px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: isAuthPage ? 'center' : 'flex-start',
          }}
        >
          
          <Routes>
            <Route path="/mytasks" element={<Mytasks />} />
            <Route path="/teammembers" element={<TeamMembers />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/new-project" element={<div>New Project Page (To Be Implemented)</div>} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/" element={<LoginForm />} />
            <Route path="*" element={<Navigate to="/mytasks" replace />} />
            <Route path="/manage-access" element={<PermissionsManagement />} />

          </Routes>
        </div>
      </div>
    </TaskProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}