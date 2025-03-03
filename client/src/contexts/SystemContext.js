// client/src/contexts/SystemContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [stats, setStats] = useState(null);
  const [quests, setQuests] = useState([]);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load user data when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Load stats
        const statsRes = await api.get('/stats');
        setStats(statsRes.data);
        
        // Load quests
        const questsRes = await api.get('/quests');
        setQuests(questsRes.data);
        
        // Load items
        const itemsRes = await api.get('/items');
        setItems(itemsRes.data);
        
        // Load notes
        const notesRes = await api.get('/notes');
        setNotes(notesRes.data.content);
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [isAuthenticated]);
  
  // Stats methods
  const saveStats = async (updatedStats) => {
    try {
      const res = await api.put('/stats', updatedStats);
      setStats(res.data);
      return { success: true };
    } catch (err) {
      setError('Error saving stats');
      return { success: false, error: 'Error saving stats' };
    }
  };
  
  // Quest methods
  const addQuest = async (quest) => {
    try {
      const res = await api.post('/quests', quest);
      setQuests([res.data, ...quests]);
      return { success: true, quest: res.data };
    } catch (err) {
      setError('Error adding quest');
      return { success: false, error: 'Error adding quest' };
    }
  };
  
  const completeQuest = async (questId) => {
    try {
      const res = await api.put(`/quests/complete/${questId}`);
      
      // Update quests list
      setQuests(quests.map(quest => 
        quest._id === questId ? { ...quest, completed: true } : quest
      ));

      // Update user level and experience if needed
      if (user) {
        user.level = res.data.level;
        user.experience = res.data.experience;
      }
      
      return { 
        success: true,
        level: res.data.level,
        experience: res.data.experience
      };
    } catch (err) {
      setError('Error completing quest');
      return { success: false, error: 'Error completing quest' };
    }
  };
  
  const deleteQuest = async (questId) => {
    try {
      await api.delete(`/quests/${questId}`);
      setQuests(quests.filter(quest => quest._id !== questId));
      return { success: true };
    } catch (err) {
      setError('Error deleting quest');
      return { success: false, error: 'Error deleting quest' };
    }
  };
  
  // Item methods
  const addItem = async (item) => {
    try {
      const res = await api.post('/items', item);
      
      // Check if item already exists
      const existingItemIndex = items.findIndex(i => i._id === res.data._id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        setItems(items.map((item, index) => 
          index === existingItemIndex ? res.data : item
        ));
      } else {
        // Add new item
        setItems([...items, res.data]);
      }
      
      return { success: true, item: res.data };
    } catch (err) {
      setError('Error adding item');
      return { success: false, error: 'Error adding item' };
    }
  };
  
  const updateItemQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/items/${itemId}`, { quantity });
      
      if (res.data.msg === 'Item removed') {
        // Item was removed due to quantity <= 0
        setItems(items.filter(item => item._id !== itemId));
      } else {
        // Update item quantity
        setItems(items.map(item => 
          item._id === itemId ? res.data : item
        ));
      }
      
      return { success: true };
    } catch (err) {
      setError('Error updating item');
      return { success: false, error: 'Error updating item' };
    }
  };
  
  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      return { success: true };
    } catch (err) {
      setError('Error deleting item');
      return { success: false, error: 'Error deleting item' };
    }
  };
  
  // Notes methods
  const saveNotes = async (content) => {
    try {
      const res = await api.put('/notes', { content });
      setNotes(res.data.content);
      return { success: true };
    } catch (err) {
      setError('Error saving notes');
      return { success: false, error: 'Error saving notes' };
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return (
    <SystemContext.Provider
      value={{
        stats,
        quests,
        items,
        notes,
        loading,
        error,
        saveStats,
        addQuest,
        completeQuest,
        deleteQuest,
        addItem,
        updateItemQuantity,
        deleteItem,
        saveNotes,
        clearError
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};