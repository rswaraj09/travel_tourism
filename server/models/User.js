const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  passportNumber: {
    type: String,
    trim: true
  },
  preferences: {
    preferredAirlines: [String],
    preferredHotels: [String],
    seatPreference: {
      type: String,
      enum: ['window', 'aisle', 'middle']
    },
    mealPreference: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'halal', 'kosher']
    },
    budgetRange: {
      min: Number,
      max: Number
    },
    travelStyle: [{
      type: String,
      enum: ['budget', 'luxury', 'adventure', 'relaxation', 'cultural', 'business']
    }]
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  travelHistory: [{
    destination: String,
    date: Date,
    type: {
      type: String,
      enum: ['flight', 'hotel', 'package', 'bus', 'train']
    }
  }],
  savedCards: [{
    cardType: String,
    lastFourDigits: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: Boolean
  }],
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema); 