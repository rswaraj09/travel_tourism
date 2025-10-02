const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    logo: String
  },
  origin: {
    airport: {
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    }
  },
  destination: {
    airport: {
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    }
  },
  departure: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    terminal: String,
    gate: String
  },
  arrival: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    terminal: String,
    gate: String
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  aircraft: {
    type: String,
    required: true
  },
  seats: {
    economy: {
      total: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    },
    business: {
      total: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    },
    first: {
      total: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'entertainment', 'meals', 'drinks', 'blankets', 'pillows', 'power-outlets']
  }],
  baggage: {
    cabin: {
      weight: Number,
      dimensions: String
    },
    checked: {
      weight: Number,
      dimensions: String
    }
  },
  cancellationPolicy: {
    refundable: {
      type: Boolean,
      default: false
    },
    cancellationFee: {
      type: Number,
      default: 0
    },
    cancellationDeadline: {
      type: Number // hours before departure
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'boarding', 'departed', 'arrived'],
    default: 'scheduled'
  },
  delay: {
    isDelayed: {
      type: Boolean,
      default: false
    },
    delayTime: Number, // in minutes
    reason: String
  },
  stops: [{
    airport: {
      code: String,
      name: String,
      city: String
    },
    duration: Number, // layover duration in minutes
    arrivalTime: String,
    departureTime: String
  }],
  isDirect: {
    type: Boolean,
    default: true
  },
  isInternational: {
    type: Boolean,
    required: true
  },
  taxes: {
    type: Number,
    default: 0
  },
  fuelSurcharge: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient searching
flightSchema.index({ 
  'origin.airport.code': 1, 
  'destination.airport.code': 1, 
  'departure.date': 1 
});

flightSchema.index({ 
  'airline.code': 1, 
  'flightNumber': 1 
});

// Virtual for formatted duration
flightSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Virtual for total available seats
flightSchema.virtual('totalAvailableSeats').get(function() {
  return this.seats.economy.available + this.seats.business.available + this.seats.first.available;
});

// Method to check if flight is available
flightSchema.methods.isAvailable = function() {
  return this.status === 'scheduled' && this.totalAvailableSeats > 0;
};

// Method to get lowest price
flightSchema.methods.getLowestPrice = function() {
  const prices = [
    this.seats.economy.price,
    this.seats.business.price,
    this.seats.first.price
  ].filter(price => price > 0);
  
  return Math.min(...prices);
};

module.exports = mongoose.model('Flight', flightSchema); 