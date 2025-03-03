// server/routes/quests.js
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Quest = require('../models/Quest');
const User = require('../models/User');
const Stats = require('../models/Stats');

// @route   GET api/quests
// @desc    Get all user quests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(quests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/quests
// @desc    Add new quest
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, details, reward } = req.body;
    
    const newQuest = new Quest({
      userId: req.user.id,
      name,
      description,
      details,
      reward: reward || 100
    });
    
    const quest = await newQuest.save();
    
    res.json(quest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/quests/complete/:id
// @desc    Complete a quest
// @access  Private
router.put('/complete/:id', auth, async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }
    
    // Check user
    if (quest.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Check if already completed
    if (quest.completed) {
      return res.status(400).json({ msg: 'Quest already completed' });
    }
    
    // Mark as completed
    quest.completed = true;
    await quest.save();
    
    // Add experience to user
    const user = await User.findById(req.user.id);
    user.experience += quest.reward;
    
    // Check if level up
    const nextLevelExp = user.level * 1000;
    if (user.experience >= nextLevelExp) {
      user.level += 1;
      user.experience -= nextLevelExp;
      
      // Add stat points
      const stats = await Stats.findOne({ userId: req.user.id });
      stats.availablePoints += 5;
      await stats.save();
    }
    
    await user.save();
    
    res.json({ 
      quest, 
      level: user.level, 
      experience: user.experience 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/quests/:id
// @desc    Delete a quest
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }
    
    // Check user
    if (quest.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await quest.deleteOne();
    
    res.json({ msg: 'Quest removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;