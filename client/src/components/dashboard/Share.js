// client/src/components/dashboard/Share.js
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SystemContext } from '../../contexts/SystemContext';
import { generateShareUrl } from '../../utils/formatter';

const Share = ({ showNotification }) => {
  const { user } = useContext(AuthContext);
  const { stats } = useContext(SystemContext);
  
  // Generate share URL
  const shareUrl = generateShareUrl(user ? user._id : '', user ? user.level : 1, stats);
  
  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    if (showNotification) {
      showNotification('Link copied to clipboard!');
    }
  };
  
  // Generate new share link with random ID
  const refreshLink = () => {
    if (showNotification) {
      showNotification('New share link generated!');
    }
  };
  
  return (
    <div>
      <div className="system-message">
        Generate a link to share your current stats and level with others.
      </div>
      <div className="share-section">
        <input 
          type="text" 
          readOnly 
          value={shareUrl}
          className="share-link" 
        />
        <button 
          className="button" 
          onClick={copyToClipboard}
        >
          COPY LINK
        </button>
        <button 
          className="button" 
          onClick={refreshLink}
        >
          GENERATE NEW
        </button>
      </div>
    </div>
  );
};

export default Share;