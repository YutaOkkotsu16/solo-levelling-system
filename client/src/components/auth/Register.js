// client/src/components/auth/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [formError, setFormError] = useState('');
  const { username, email, password, password2 } = formData;
  
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    // Check all fields are filled
    if (!username || !email || !password || !password2) {
      setFormError('Please enter all fields');
      return;
    }
    
    // Check passwords match
    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Check password length
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    const result = await register(username, email, password);
    
    if (!result.success) {
      setFormError(result.error || 'Registration failed');
    }
  };
  
  return (
    <div className="auth-container">
      <div className="system-window">
        <h2 className="window-title">REGISTER NEW ACCOUNT</h2>
        <div className="system-message">
          Create a new account to access the system.
        </div>
        
        <form onSubmit={onSubmit}>
          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              className="form-input"
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={password2}
              onChange={onChange}
              className="form-input"
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="button register-button">
            REGISTER
          </button>
          
          <div className="form-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


