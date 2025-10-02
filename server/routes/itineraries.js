const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/itineraries
// @desc    Get user itineraries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Mock itinerary data
    const itineraries = [
      {
        id: 1,
        title: 'Bali Trip',
        destination: 'Bali, Indonesia',
        startDate: '2024-02-01',
        endDate: '2024-02-07',
        activities: ['Visit temples', 'Beach day', 'Spa day']
      }
    ];
    
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 