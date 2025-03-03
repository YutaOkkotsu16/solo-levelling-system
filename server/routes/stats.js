// server/routes/stats.js
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Stats = require('../models/Stats');

// @route   GET api/stats
// @desc    Get user stats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const stats = await Stats.findOne({ userId: req.user.id });
    
    if (!stats) {
      return res.status(404).json({ msg: 'Stats not found' });
    }
    
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/stats
// @desc    Update user stats
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const {
      strength,
      agility,
      intelligence,
      endurance,
      vitality,
      perception,
      willpower,
      charisma,
      availablePoints
    } = req.body;
    
    // Find and update stats
    let stats = await Stats.findOne({ userId: req.user.id });
    
    if (!stats) {
      return res.status(404).json({ msg: 'Stats not found' });
    }
    
    // Update fields
    stats.strength = strength || stats.strength;
    stats.agility = agility || stats.agility;
    stats.intelligence = intelligence || stats.intelligence;
    stats.endurance = endurance || stats.endurance;
    stats.vitality = vitality || stats.vitality;
    stats.perception = perception || stats.perception;
    stats.willpower = willpower || stats.willpower;
    stats.charisma = charisma || stats.charisma;
    stats.availablePoints = availablePoints !== undefined ? availablePoints : stats.availablePoints;
    
    await stats.save();
    
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;