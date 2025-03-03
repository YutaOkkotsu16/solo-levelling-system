// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding tab
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Save quests to localStorage whenever a change happens
function saveQuests() {
    const questsTab = document.getElementById('quests-tab');
    const questItems = questsTab.querySelectorAll('.quest-item');
    
    const questsData = Array.from(questItems).map(quest => {
        const name = quest.querySelector('.quest-name').textContent;
        const status = quest.querySelector('.quest-status').textContent;
        const description = quest.querySelector('.quest-description').textContent;
        
        // Get notes if they exist (either from textarea or from static div)
        let notes = '';
        const notesArea = quest.querySelector('.notes-area');
        if (notesArea) {
            notes = notesArea.value || notesArea.textContent;
        }
        
        const isCompleted = quest.classList.contains('completed');
        
        return { name, status, description, notes, isCompleted };
    });
    
    localStorage.setItem('questsData', JSON.stringify(questsData));
}

// Load quests from localStorage when page loads
function loadQuests() {
    const savedQuests = localStorage.getItem('questsData');
    if (!savedQuests) return;
    
    const questsData = JSON.parse(savedQuests);
    const questsTab = document.getElementById('quests-tab');
    
    // Clear existing quests except the add button
    const addButton = document.getElementById('add-quest-btn');
    while (questsTab.firstChild && questsTab.firstChild !== addButton) {
        questsTab.removeChild(questsTab.firstChild);
    }
    
    // Recreate quests from saved data
    questsData.forEach(questData => {
        const newQuest = document.createElement('div');
        newQuest.className = 'quest-item';
        if (questData.isCompleted) {
            newQuest.classList.add('completed');
        }
        
        newQuest.innerHTML = `
            <div class="quest-title">
                <div class="quest-name">${questData.name}</div>
                <div class="quest-status">${questData.status}</div>
            </div>
            <div class="quest-description">${questData.description}</div>
        `;
        
        // Add notes based on completed status
        if (!questData.isCompleted) {
            const textarea = document.createElement('textarea');
            textarea.className = 'notes-area';
            textarea.placeholder = 'Add task details...';
            textarea.style = 'height: 50px; width: 100%; resize: vertical;';
            textarea.value = questData.notes;
            newQuest.appendChild(textarea);
            
            // Add the complete button
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = 'MARK AS COMPLETE';
            button.onclick = function() { completeQuest(this); };
            newQuest.appendChild(button);
        } else if (questData.notes) {
            // For completed quests with notes, add them as read-only
            const notesDiv = document.createElement('div');
            notesDiv.className = 'quest-notes';
            notesDiv.textContent = questData.notes;
            newQuest.appendChild(notesDiv);
        }
        
        // Insert before the add button
        questsTab.insertBefore(newQuest, addButton);
    });
}

// Save stats functionality
document.getElementById('save-stats-btn').addEventListener('click', () => {
    showNotification('Stats saved successfully!');
    saveStats();
});

// Reset stats
document.getElementById('reset-stats-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all stats?')) {
        document.querySelectorAll('.editable-stat-value').forEach(input => {
            input.value = 50;
        });
        document.getElementById('available-points').textContent = 40;
        showNotification('Stats have been reset!');
        saveStats();
    }
});

// Update the add quest function
document.getElementById('add-quest-btn').addEventListener('click', () => {
    const questsTab = document.getElementById('quests-tab');
    const newQuest = document.createElement('div');
    newQuest.className = 'quest-item';
    
    // Create structure with proper contenteditable elements
    newQuest.innerHTML = `
        <div class="quest-title">
            <div class="quest-name" contenteditable="true">New Quest</div>
            <div class="quest-status">IN PROGRESS</div>
        </div>
        <div class="quest-description" contenteditable="true">Click to edit quest description</div>
        <textarea placeholder="Add task details..." class="notes-area" style="height: 50px; width: 100%; resize: vertical;"></textarea>
        <button class="button" onclick="completeQuest(this)">MARK AS COMPLETE</button>
    `;
    
    // Make contenteditable elements truly editable
    const questName = newQuest.querySelector('.quest-name');
    const questDescription = newQuest.querySelector('.quest-description');
    
    // Make sure focus works and selects all text when clicked
    questName.addEventListener('click', function() {
        if (this.textContent === 'New Quest') {
            // Select all text for easy replacement
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
    
    questDescription.addEventListener('click', function() {
        if (this.textContent === 'Click to edit quest description') {
            // Select all text for easy replacement
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
    
    // Listen for changes to save to localStorage
    questName.addEventListener('input', saveQuests);
    questDescription.addEventListener('input', saveQuests);
    
    // Insert before the add button
    questsTab.insertBefore(newQuest, document.getElementById('add-quest-btn'));
    
    // Save the updated quests
    saveQuests();
});

// Update the completeQuest function to save changes
function completeQuest(button) {
    const questItem = button.closest('.quest-item');
    questItem.classList.add('completed');
    const statusElement = questItem.querySelector('.quest-status');
    statusElement.textContent = 'COMPLETED';
    
    // Convert textarea to static div if it has content
    const notesTextarea = questItem.querySelector('.notes-area');
    if (notesTextarea && notesTextarea.value.trim() !== '') {
        const notesContent = document.createElement('div');
        notesContent.className = 'quest-notes';
        notesContent.textContent = notesTextarea.value;
        notesTextarea.parentNode.insertBefore(notesContent, notesTextarea);
        notesTextarea.remove();
    } else if (notesTextarea) {
        notesTextarea.remove();
    }
    
    // Remove the button
    button.remove();
    
    // Add experience
    addExperience(100);
    showNotification('Quest completed! +100 XP');
    
    // Save the updated quests
    saveQuests();
}

// Add item functionality
document.getElementById('add-item-btn').addEventListener('click', () => {
    const inventoryGrid = document.querySelector('.inventory-grid');
    const icons = ['🧪', '📊', '🔮', '🛡️', '🧭', '📈', '🔬', '📝'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    const newItem = document.createElement('div');
    newItem.className = 'inventory-item';
    newItem.innerHTML = `
        <div class="item-icon">${randomIcon}</div>
        <div class="item-name" contenteditable="true">New Item</div>
        <div class="item-quantity">x1</div>
    `;
    
    inventoryGrid.appendChild(newItem);
});

// Save notes
document.getElementById('save-notes-btn').addEventListener('click', () => {
    showNotification('Notes saved successfully!');
    // In a real application, this would save to localStorage or a server
});

// Copy share link
document.getElementById('copy-link-btn').addEventListener('click', () => {
    const shareLink = document.getElementById('share-link');
    shareLink.select();
    document.execCommand('copy');
    showNotification('Link copied to clipboard!');
});

// Generate new share link
document.getElementById('refresh-link-btn').addEventListener('click', () => {
    const shareLink = document.getElementById('share-link');
    const randomId = Math.random().toString(36).substring(2, 10);
    
    // Get current stats
    const stats = [];
    document.querySelectorAll('.editable-stat-value').forEach(input => {
        stats.push(input.value);
    });
    
    const level = document.getElementById('level-display').textContent;
    shareLink.value = `https://mysystem.io/share/${randomId}?l=${level}&s=${stats.join(',')}`;
    showNotification('New share link generated!');
});

// Show notification function
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add experience and update level bar
function addExperience(amount) {
    // In a real application, this would track actual XP
    const expBar = document.getElementById('exp-bar');
    const currentWidth = parseFloat(expBar.style.width || '35');
    let newWidth = currentWidth + (amount / 10);
    
    if (newWidth >= 100) {
        // Level up!
        levelUp();
        newWidth = newWidth - 100;
    }
    
    expBar.style.width = newWidth + '%';
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    const currentLevel = parseInt(document.getElementById('level-display').textContent);
    const requiredXP = currentLevel * 100;
    const currentXP = Math.floor(requiredXP * (newWidth / 100));
    progressText.textContent = `${newWidth.toFixed(0)}% | ${currentXP}/${requiredXP} XP`;
}

// Level up function
function levelUp() {
    const levelDisplay = document.getElementById('level-display');
    const currentLevel = parseInt(levelDisplay.textContent);
    levelDisplay.textContent = currentLevel + 1;
    
    // Add stat points
    const availablePoints = document.getElementById('available-points');
    availablePoints.textContent = parseInt(availablePoints.textContent) + 5;
    
    showNotification('LEVEL UP! +5 Stat Points');
}

// Save stats function
function saveStats() {
    // In a real application, this would save to localStorage or a server
    
    // Update share link
    const shareLink = document.getElementById('share-link');
    const stats = [];
    document.querySelectorAll('.editable-stat-value').forEach(input => {
        stats.push(input.value);
    });
    
    const level = document.getElementById('level-display').textContent;
    const randomId = Math.random().toString(36).substring(2, 10);
    shareLink.value = `https://mysystem.io/share/${randomId}?l=${level}&s=${stats.join(',')}`;
}

// Track stat changes to update available points
let originalTotal = 0;
document.querySelectorAll('.editable-stat-value').forEach(input => {
    originalTotal += parseInt(input.value);
    
    input.addEventListener('change', () => {
        let newTotal = 0;
        document.querySelectorAll('.editable-stat-value').forEach(statInput => {
            newTotal += parseInt(statInput.value);
        });
        
        const difference = newTotal - originalTotal;
        const availablePoints = document.getElementById('available-points');
        const currentPoints = parseInt(availablePoints.textContent);
        
        if (difference > currentPoints) {
            // Not enough points
            input.value = parseInt(input.value) - (difference - currentPoints);
            availablePoints.textContent = 0;
        } else {
            availablePoints.textContent = currentPoints - difference;
        }
        
        originalTotal = 0;
        document.querySelectorAll('.editable-stat-value').forEach(statInput => {
            originalTotal += parseInt(statInput.value);
        });
    });
});

// Add event listeners to detect changes in quest content
document.addEventListener('input', function(e) {
    // Check if the event target is within a quest
    if (e.target.closest('.quest-item')) {
        saveQuests();
    }
});

// Load quests when the page loads
document.addEventListener('DOMContentLoaded', loadQuests);

///
//
//
//
//
//
//


