const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  chain: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      street: String,
      city: {
        type: String,
        required: true
      },
      state: String,
      country: {
        type: String,
        required: true
      },
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    nearbyAttractions: [{
      name: String,
      distance: Number,
      type: String
    }],
    airportDistance: Number,
    cityCenterDistance: Number
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  amenities: {
    general: [{
      type: String,
      enum: ['wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'room-service', 'laundry', 'business-center', 'concierge', 'airport-shuttle']
    }],
    room: [{
      type: String,
      enum: ['ac', 'tv', 'minibar', 'safe', 'balcony', 'ocean-view', 'mountain-view', 'city-view', 'kitchen', 'living-room']
    }],
    accessibility: [{
      type: String,
      enum: ['wheelchair-accessible', 'elevator', 'ramp', 'accessible-bathroom', 'braille-signs', 'hearing-aids']
    }]
  },
  roomTypes: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    capacity: {
      adults: {
        type: Number,
        required: true
      },
      children: {
        type: Number,
        default: 0
      }
    },
    size: Number,
    beds: [{
      type: {
        type: String,
        enum: ['single', 'double', 'queen', 'king', 'twin', 'sofa-bed']
      },
      count: Number
    }],
    amenities: [String],
    images: [String],
    pricing: {
      basePrice: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'USD'
      },
      taxes: {
        type: Number,
        default: 0
      },
      fees: {
        type: Number,
        default: 0
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
          type: Number
        }
      }
    },
    availability: {
      total: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      }
    }
  }],
  policies: {
    checkIn: {
      time: {
        type: String,
        default: '15:00'
      },
      minAge: {
        type: Number,
        default: 18
      }
    },
    checkOut: {
      time: {
        type: String,
        default: '11:00'
      }
    },
    pets: {
      allowed: {
        type: Boolean,
        default: false
      },
      fee: Number,
      restrictions: String
    },
    smoking: {
      allowed: {
        type: Boolean,
        default: false
      },
      areas: [String]
    },
    children: {
      allowed: {
        type: Boolean,
        default: true
      },
      extraBedFee: Number,
      cribFee: Number
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    },
    categories: {
      cleanliness: Number,
      service: Number,
      location: Number,
      value: Number
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    caption: String,
    category: {
      type: String,
      enum: ['exterior', 'lobby', 'room', 'amenity', 'restaurant', 'pool', 'gym']
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

hotelSchema.index({ 
  'location.address.city': 1, 
  'location.address.country': 1 
});

hotelSchema.index({ 
  starRating: -1, 
  averageRating: -1 
});

hotelSchema.virtual('calculatedAverageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / this.reviews.length).toFixed(1);
});

hotelSchema.methods.checkAvailability = function(roomTypeName, checkIn, checkOut, guests) {
  const roomType = this.roomTypes.find(rt => rt.name === roomTypeName);
  if (!roomType) return false;
  
  const totalCapacity = roomType.capacity.adults + roomType.capacity.children;
  if (guests > totalCapacity) return false;
  
  return roomType.availability.available > 0;
};

hotelSchema.methods.getLowestPrice = function() {
  const prices = this.roomTypes
    .filter(rt => rt.availability.available > 0)
    .map(rt => rt.pricing.basePrice);
  
  return prices.length > 0 ? Math.min(...prices) : 0;
};

hotelSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    this.averageRating = parseFloat(this.calculatedAverageRating);
    this.totalReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Hotel', hotelSchema); 