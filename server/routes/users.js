const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // Mock user profile
    const profile = {
      id: req.user.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    };
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 