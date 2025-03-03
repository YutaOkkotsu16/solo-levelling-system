// client/src/components/dashboard/Notes.js
import React, { useContext, useState, useEffect } from 'react';
import { SystemContext } from '../../contexts/SystemContext';

const Notes = ({ showNotification }) => {
  const { notes, saveNotes } = useContext(SystemContext);
  const [localNotes, setLocalNotes] = useState('');
  
  // Initialize local notes from context
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);
  
  // Handle notes change
  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
  };
  
  // Save notes to server
  const handleSaveNotes = async () => {
    const result = await saveNotes(localNotes);
    
    if (result.success) {
      showNotification('Notes saved successfully!');
    } else {
      showNotification('Error saving notes!', 'error');
    }
  };
  
  return (
    <div>
      <textarea 
        className="notes-area" 
        style={{ height: '300px' }} 
        placeholder="Add your personal notes here..."
        value={localNotes}
        onChange={handleNotesChange}
      ></textarea>
      <div>
        <button className="button" onClick={handleSaveNotes}>
          SAVE NOTES
        </button>
      </div>
    </div>
  );
};

export default Notes;