// client/src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      
      // Redirect to login page if the app is in the browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// client/src/utils/formatter.js
// Helper functions for formatting data

/**
 * Format experience percentage
 * @param {number} experience - Current experience points
 * @param {number} level - Current level
 * @returns {number} - Percentage of progress to next level (0-100)
 */
export const formatExpPercentage = (experience, level) => {
  const requiredXP = level * 1000;
  return Math.min(Math.floor((experience / requiredXP) * 100), 100);
};

/**
 * Format experience display text
 * @param {number} experience - Current experience points
 * @param {number} level - Current level
 * @returns {string} - Formatted text (e.g. "350/1000 XP")
 */
export const formatExpText = (experience, level) => {
  const requiredXP = level * 1000;
  return `${experience}/${requiredXP} XP`;
};

/**
 * Generate share URL
 * @param {string} userId - User ID
 * @param {number} level - User level
 * @param {object} stats - User stats object
 * @returns {string} - Share URL
 */
export const generateShareUrl = (userId, level, stats) => {
  if (!stats) return '';
  
  const randomId = Math.random().toString(36).substring(2, 8);
  const statValues = [
    stats.strength,
    stats.agility,
    stats.intelligence,
    stats.endurance,
    stats.vitality,
    stats.perception,
    stats.willpower,
    stats.charisma
  ].join(',');
  
  return `${window.location.origin}/share/${randomId}?l=${level}&s=${statValues}`;
};

