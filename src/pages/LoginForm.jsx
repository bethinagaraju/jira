
import React, { useEffect, useState } from 'react';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { useTasks} from '../context/TaskContext';

const LoginForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const {teamMembers, setRole, setUserName, setUserAvatar} = useTasks();

  useEffect(() => {
    console.log('Team Members:', teamMembers);
    console.log(teamMembers);
  },[])

  const CheckUser = (userMail) => {
    const user = teamMembers.find((member) => member.email === userMail);
    if (user) {
      setRole(user.role.replace(/\s+/g, '').toLowerCase());
      setUserName(user.name);
      setUserAvatar(user.avatar);
      navigate('/mytasks');
    }
    else{
      alert('User not found');
    }
  }

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    CheckUser(email);
  };

  return (
    <div className={`login-container ${isActive ? 'active' : ''}`}>
      <div className="login-form-container login-sign-up">
        <form>
          <h1>Create Account</h1>
          <div className="login-social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      <div className="login-form-container login-sign-in">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <div className="login-social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>or use your email password</span>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" />
          <a href="#">Forget Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="login-toggle-container">
        <div className="login-toggle">
          <div className="login-toggle-panel login-toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" onClick={toggleForm}>
              Sign In
            </button>
          </div>
          <div className="login-toggle-panel login-toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" onClick={toggleForm}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
