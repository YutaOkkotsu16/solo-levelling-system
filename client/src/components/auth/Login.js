// client/src/components/auth/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const { email, password } = formData;
  
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
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
    
    if (!email || !password) {
      setFormError('Please enter all fields');
      return;
    }
    
    const result = await login(email, password);
    
    if (!result.success) {
      setFormError(result.error || 'Login failed');
    }
  };
  
  return (
    <div className="auth-container">
      <div className="system-window">
        <h2 className="window-title">LOGIN TO SYSTEM</h2>
        <div className="system-message">
          Enter your credentials to access your personal system.
        </div>
        
        <form onSubmit={onSubmit}>
          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}
          
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
            />
          </div>
          
          <button type="submit" className="button login-button">
            LOGIN
          </button>
          
          <div className="form-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

