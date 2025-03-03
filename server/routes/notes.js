// server/routes/notes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// @route   GET api/notes
// @desc    Get user notes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let note = await Note.findOne({ userId: req.user.id });
    
    if (!note) {
      note = new Note({
        userId: req.user.id,
        content: ''
      });
      
      await note.save();
    }
    
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notes
// @desc    Update notes
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    let note = await Note.findOne({ userId: req.user.id });
    
    if (!note) {
      note = new Note({
        userId: req.user.id,
        content
      });
    } else {
      note.content = content;
      note.updatedAt = Date.now();
    }
    
    await note.save();
    
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;