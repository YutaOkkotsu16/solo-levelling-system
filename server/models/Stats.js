// server/models/Stats.js
const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  strength: { 
    type: Number, 
    default: 50 
  },
  agility: { 
    type: Number, 
    default: 50 
  },
  intelligence: { 
    type: Number, 
    default: 50 
  },
  endurance: { 
    type: Number, 
    default: 50 
  },
  vitality: { 
    type: Number, 
    default: 50 
  },
  perception: { 
    type: Number, 
    default: 50 
  },
  willpower: { 
    type: Number, 
    default: 50 
  },
  charisma: { 
    type: Number, 
    default: 50 
  },
  availablePoints: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Stats', StatsSchema);
