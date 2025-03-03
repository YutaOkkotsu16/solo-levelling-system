// src/utils/formatter.js
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