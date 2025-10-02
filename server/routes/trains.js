const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

// @route   GET /api/trains/search
// @desc    Search trains using Gemini AI
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { from, to, departure, passengers = 1, travelClass = 'Sleeper' } = req.query;

    if (!from || !to || !departure) {
      return res.status(400).json({ error: 'Missing required search parameters: from, to, departure' });
    }

    const trains = await geminiService.getTrainRecommendations(from, to, departure, passengers, travelClass);
    
    res.json({
      trains: trains,
      searchCriteria: req.query,
      totalResults: Array.isArray(trains) ? trains.length : 0
    });
  } catch (error) {
    console.error('Train search error:', error);
    res.status(500).json({ error: 'Server error while fetching trains from Gemini' });
  }
});

// @route   GET /api/trains
// @desc    Get all trains (placeholder, as search is primary)
// @access  Public
router.get('/', async (req, res) => {
  res.json({ message: "Please use /api/trains/search to find trains." });
});

// @route   GET /api/trains/:id
// @desc    Get train details (will need adjustment for AI-based data)
// @access  Public
router.get('/:id', async (req, res) => {
  res.status(404).json({ error: 'Fetching a specific train by ID is not supported with AI search.' });
});

module.exports = router; 