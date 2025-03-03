// server/server.js
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const router = express.Router();
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/quests', require('./routes/quests'));
app.use('/api/items', require('./routes/items'));
app.use('/api/notes', require('./routes/notes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});




