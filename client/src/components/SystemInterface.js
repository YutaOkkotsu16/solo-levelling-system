// client/src/components/SystemInterface.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SystemContext } from '../contexts/SystemContext';
import Notification from './layout/Notification';
import Status from './dashboard/Status.js';
import Quests from './dashboard/Quests';
import Inventory from './dashboard/Inventory';
import Notes from './dashboard/Notes';
import Share from './dashboard/Share';
import { formatExpPercentage, formatExpText } from '../utils/formatter';

const SystemInterface = () => {
  const { user } = useContext(AuthContext);
  const { loading, error } = useContext(SystemContext);
  
  const [activeTab, setActiveTab] = useState('status');
  const [notification, setNotification] = useState(null);
  
  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  // Close notification helper
  const closeNotification = () => {
    setNotification(null);
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  return (
    <>
      <div className="system-window">
        <h2 className="window-title">PERSONAL SYSTEM INTERFACE</h2>
        
        {/* Level and Experience Display */}
        <div className="level-display">
          <div className="level-number">{user.level}</div>
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${formatExpPercentage(user.experience, user.level)}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {formatExpPercentage(user.experience, user.level)}% | {formatExpText(user.experience, user.level)}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            STATUS
          </button>
          <button 
            className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            QUESTS
          </button>
          <button 
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            INVENTORY
          </button>
          <button 
            className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            NOTES
          </button>
          <button 
            className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            SHARE
          </button>
        </div>
        
        {/* Tab Content */}
        <div className={`tab-content ${activeTab === 'status' ? 'active' : ''}`}>
          <Status showNotification={showNotification} />
        </div>
        
        <div className={`tab-content ${activeTab === 'quests' ? 'active' : ''}`}>
          <Quests showNotification={showNotification} />
        </div>
        
        <div className={`tab-content ${activeTab === 'inventory' ? 'active' : ''}`}>
          <Inventory showNotification={showNotification} />
        </div>
        
        <div className={`tab-content ${activeTab === 'notes' ? 'active' : ''}`}>
          <Notes showNotification={showNotification} />
        </div>
        
        <div className={`tab-content ${activeTab === 'share' ? 'active' : ''}`}>
          <Share />
        </div>
      </div>
      
      {/* Notification component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default SystemInterface;