const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

// @route   GET /api/flights/search
// @desc    Search flights using Gemini AI
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { from, to, departure, passengers = 1, cabinClass = 'Economy' } = req.query;

    if (!from || !to || !departure) {
      return res.status(400).json({ error: 'Missing required search parameters: from, to, departure' });
    }

    const flights = await geminiService.getFlightRecommendations(from, to, departure, passengers, cabinClass);
    
    res.json({
      flights: flights,
      searchCriteria: req.query,
      totalResults: Array.isArray(flights) ? flights.length : 0
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Server error while fetching flights from Gemini' });
  }
});

// @route   GET /api/flights
// @desc    Get all flights (placeholder, as search is primary)
// @access  Public
router.get('/', async (req, res) => {
  res.json({ message: "Please use /api/flights/search to find flights." });
});


// @route   GET /api/flights/:id
// @desc    Get flight details by ID (searches AI-generated flights)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { from, to, date, passengers = 1, travelClass = 'Economy' } = req.query;
    // Use the actual search parameters from the frontend
    const flights = await geminiService.getFlightRecommendations(from, to, date, passengers, travelClass);
    const flight = Array.isArray(flights)
      ? flights.find(f => f.flightNumber === req.params.id || f._id === req.params.id)
      : null;
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight by ID:', error);
    res.status(500).json({ error: 'Server error fetching flight' });
  }
});

module.exports = router; 