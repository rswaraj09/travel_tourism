const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Mock payment intent
    const paymentIntent = {
      id: 'pi_mock_123',
      amount: amount,
      currency: 'inr',
      status: 'requires_payment_method'
    };
    
    res.json({ clientSecret: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 