// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SystemProvider } from './contexts/SystemContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SystemInterface from './components/SystemInterface';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/" element={
              <PrivateRoute>
                <SystemProvider>
                  <SystemInterface />
                </SystemProvider>
              </PrivateRoute>
            } />
            <Route exact path="/share/:id" element={<SystemShare />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component for public share links
const SystemShare = () => {
  // Get shared stats from URL parameters
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const level = queryParams.get('l') || '1';
  const stats = queryParams.get('s') ? queryParams.get('s').split(',') : [];
  
  const statNames = [
    'Strength', 'Agility', 'Intelligence', 'Endurance',
    'Vitality', 'Perception', 'Willpower', 'Charisma'
  ];
  
  return (
    <div className="system-window share-view">
      <h2 className="window-title">SHARED SYSTEM STATS</h2>
      <div className="level-display">
        <div className="level-number">{level}</div>
        <div className="share-username">User ID: {id}</div>
      </div>
      
      <div className="stats-grid">
        {stats.map((value, index) => (
          <div key={index} className="stat-item">
            <span className="stat-name">{statNames[index] || `Stat ${index + 1}`}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;