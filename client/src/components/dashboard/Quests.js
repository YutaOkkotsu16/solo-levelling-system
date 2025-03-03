// client/src/components/dashboard/Quests.js
import React, { useContext, useState } from 'react';
import { SystemContext } from '../../contexts/SystemContext';

const Quests = ({ showNotification }) => {
  const { quests, addQuest, completeQuest, deleteQuest } = useContext(SystemContext);
  const [showNewQuestForm, setShowNewQuestForm] = useState(false);
  const [newQuest, setNewQuest] = useState({
    name: '',
    description: '',
    details: '',
    reward: 100
  });
  
  // Handle input change for new quest form
  const handleInputChange = (e) => {
    setNewQuest({
      ...newQuest,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission for new quest
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newQuest.name || !newQuest.description) {
      showNotification('Please provide a name and description', 'error');
      return;
    }
    
    const result = await addQuest(newQuest);
    
    if (result.success) {
      // Reset form and hide it
      setNewQuest({
        name: '',
        description: '',
        details: '',
        reward: 100
      });
      setShowNewQuestForm(false);
      showNotification('New quest added!');
    } else {
      showNotification('Error adding quest!', 'error');
    }
  };
  
  // Handle quest completion
  const handleCompleteQuest = async (questId) => {
    const result = await completeQuest(questId);
    
    if (result.success) {
      showNotification(`Quest completed! +${result.quest?.reward || 100} XP`);
    } else {
      showNotification('Error completing quest!', 'error');
    }
  };
  
  // Handle quest deletion
  const handleDeleteQuest = async (questId) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      const result = await deleteQuest(questId);
      
      if (result.success) {
        showNotification('Quest deleted!');
      } else {
        showNotification('Error deleting quest!', 'error');
      }
    }
  };
  
  return (
    <div>
      {quests.map(quest => (
        <div 
          key={quest._id} 
          className={`quest-item ${quest.completed ? 'completed' : ''}`}
        >
          <div className="quest-title">
            <div className="quest-name">{quest.name}</div>
            <div className="quest-status">
              {quest.completed ? 'COMPLETED' : 'IN PROGRESS'}
            </div>
          </div>
          <div className="quest-description">{quest.description}</div>
          
          {!quest.completed && (
            <>
              <input 
                type="text" 
                placeholder="Add task details..." 
                className="notes-area" 
                style={{ height: '50px' }}
                value={quest.details || ''}
                onChange={() => {}}
                disabled
              />
              <div className="quest-actions">
                <button 
                  className="button" 
                  onClick={() => handleCompleteQuest(quest._id)}
                >
                  MARK AS COMPLETE
                </button>
                <button 
                  className="button delete-button" 
                  onClick={() => handleDeleteQuest(quest._id)}
                >
                  DELETE
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      
      {showNewQuestForm ? (
        <div className="new-quest-form">
          <h3>Add New Quest</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Quest Name</label>
              <input
                type="text"
                name="name"
                value={newQuest.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Daily Training"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newQuest.description}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Complete your daily workout routine"
              />
            </div>
            
            <div className="form-group">
              <label>Details (Optional)</label>
              <textarea
                name="details"
                value={newQuest.details}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Additional details about the quest"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>XP Reward</label>
              <input
                type="number"
                name="reward"
                value={newQuest.reward}
                onChange={handleInputChange}
                className="form-input"
                min="10"
                max="1000"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="button">ADD QUEST</button>
              <button 
                type="button" 
                className="button cancel-button"
                onClick={() => setShowNewQuestForm(false)}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          className="button" 
          onClick={() => setShowNewQuestForm(true)}
        >
          ADD NEW QUEST
        </button>
      )}
    </div>
  );
};

export default Quests;