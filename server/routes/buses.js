const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

// @route   GET /api/buses/search
// @desc    Search buses using Gemini AI
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { from, to, departure, passengers = 1 } = req.query;

    if (!from || !to || !departure) {
      return res.status(400).json({ error: 'Missing required search parameters: from, to, departure' });
    }

    const buses = await geminiService.getBusRecommendations(from, to, departure, passengers);
    
    res.json({
      buses: buses,
      searchCriteria: req.query,
      totalResults: Array.isArray(buses) ? buses.length : 0
    });
  } catch (error) {
    console.error('Bus search error:', error);
    res.status(500).json({ error: 'Server error while fetching buses from Gemini' });
  }
});

// @route   GET /api/buses
// @desc    Get all buses (placeholder, as search is primary)
// @access  Public
router.get('/', async (req, res) => {
  res.json({ message: "Please use /api/buses/search to find buses." });
});

// @route   GET /api/buses/:id
// @desc    Get bus details (will need adjustment for AI-based data)
// @access  Public
router.get('/:id', async (req, res) => {
  res.status(404).json({ error: 'Fetching a specific bus by ID is not supported with AI search.' });
});

module.exports = router; 