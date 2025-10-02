const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, bookingNumber, status, date, price } = req.body;
    const booking = new Booking({
      user: req.user.id,
      type,
      bookingNumber,
      status,
      date,
      price
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookings/:bookingId/pay
// @desc    Mark booking as paid and save payment details
// @access  Private
router.post('/:bookingId/pay', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const paymentDetails = req.body;
    // Update booking status and optionally save payment details
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, user: req.user.id },
      { status: 'confirmed', paymentDetails },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking confirmed and payment saved', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 