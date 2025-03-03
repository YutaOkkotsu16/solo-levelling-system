// server/routes/items.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// @route   GET api/items
// @desc    Get all user items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/items
// @desc    Add new item
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, quantity } = req.body;
    
    // Check if item exists
    let item = await Item.findOne({ 
      userId: req.user.id,
      name: name 
    });
    
    if (item) {
      // Update quantity
      item.quantity += parseInt(quantity) || 1;
      await item.save();
      return res.json(item);
    }
    
    // Create new item
    const newItem = new Item({
      userId: req.user.id,
      name,
      icon,
      quantity: parseInt(quantity) || 1
    });
    
    item = await newItem.save();
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/items/:id
// @desc    Update item quantity
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Check if item exists
    let item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Check user ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update quantity
    item.quantity = parseInt(quantity);
    
    // Remove item if quantity is 0 or less
    if (item.quantity <= 0) {
      await item.deleteOne();
      return res.json({ msg: 'Item removed' });
    }
    
    await item.save();
    res.json(item);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Check user
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await item.deleteOne();
    
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

