const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'package', 'bus', 'train'],
    required: true
  },
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  passengers: {
    type: [Object],
    default: []
  },
  contactInfo: {
    type: Object,
    default: {}
  },
  paymentDetails: {
    type: Object,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 