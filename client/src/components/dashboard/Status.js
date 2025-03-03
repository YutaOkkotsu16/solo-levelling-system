// client/src/components/dashboard/Status.js
import React, { useContext, useState, useEffect } from 'react';
import { SystemContext } from '../../contexts/SystemContext';

const Status = ({ showNotification }) => {
  const { stats, saveStats } = useContext(SystemContext);
  const [localStats, setLocalStats] = useState(null);
  
  // Initialize local stats from context
  useEffect(() => {
    if (stats) {
      setLocalStats({ ...stats });
    }
  }, [stats]);
  
  if (!localStats) {
    return <div>Loading stats...</div>;
  }
  
  // Handle stat change
  const handleStatChange = (statName, value) => {
    if (!localStats) return;
    
    // Convert value to number
    const newValue = parseInt(value);
    
    // Calculate points used
    const originalValue = stats[statName];
    const difference = newValue - originalValue;
    
    // Check if enough points available
    if (difference > localStats.availablePoints) {
      // Not enough points, revert to maximum possible
      const maxPossible = originalValue + localStats.availablePoints;
      setLocalStats({
        ...localStats,
        [statName]: maxPossible,
        availablePoints: 0
      });
    } else {
      // Update stat and available points
      setLocalStats({
        ...localStats,
        [statName]: newValue,
        availablePoints: localStats.availablePoints - difference
      });
    }
  };
  
  // Save stats to server
  const handleSaveStats = async () => {
    const result = await saveStats(localStats);
    
    if (result.success) {
      showNotification('Stats saved successfully!');
    } else {
      showNotification('Error saving stats!', 'error');
    }
  };
  
  // Reset stats to original values
  const handleResetStats = () => {
    if (!stats) return;
    
    if (window.confirm('Are you sure you want to reset all stats?')) {
      setLocalStats({ ...stats });
      showNotification('Stats have been reset!');
    }
  };
  
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-name">Strength</span>
          <input 
            type="number" 
            min="0"
            value={localStats.strength}
            onChange={(e) => handleStatChange('strength', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Agility</span>
          <input 
            type="number" 
            min="0"
            value={localStats.agility}
            onChange={(e) => handleStatChange('agility', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Intelligence</span>
          <input 
            type="number" 
            min="0"
            value={localStats.intelligence}
            onChange={(e) => handleStatChange('intelligence', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Endurance</span>
          <input 
            type="number" 
            min="0"
            value={localStats.endurance}
            onChange={(e) => handleStatChange('endurance', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Vitality</span>
          <input 
            type="number" 
            min="0"
            value={localStats.vitality}
            onChange={(e) => handleStatChange('vitality', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Perception</span>
          <input 
            type="number" 
            min="0"
            value={localStats.perception}
            onChange={(e) => handleStatChange('perception', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Willpower</span>
          <input 
            type="number" 
            min="0"
            value={localStats.willpower}
            onChange={(e) => handleStatChange('willpower', e.target.value)}
            className="editable-stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-name">Charisma</span>
          <input 
            type="number" 
            min="0"
            value={localStats.charisma}
            onChange={(e) => handleStatChange('charisma', e.target.value)}
            className="editable-stat-value"
          />
        </div>
      </div>
      
      <div className="system-message">
        Available points: <span>{localStats.availablePoints}</span>
      </div>
      
      <button className="button" onClick={handleSaveStats}>SAVE STATS</button>
      <button className="button" onClick={handleResetStats}>RESET</button>
    </div>
  );
};

export default Status;






