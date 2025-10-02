const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

// @route   GET /api/hotels/search
// @desc    Search hotels using Gemini AI
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests = 1, budget = 'any', preferences = {} } = req.query;

    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required search parameters: location, checkIn, checkOut' });
    }

    const hotelData = await geminiService.getHotelRecommendations(location, checkIn, checkOut, guests, budget, preferences);
    console.log('Hotel data from Gemini:', hotelData);
    
    // Check if there was an error in the Gemini response
    if (hotelData && hotelData.error) {
      console.error('Gemini service error:', hotelData.error);
      throw new Error(hotelData.error);
    }
    
    let hotelsArr = [];
    if (hotelData && Array.isArray(hotelData.hotels)) {
      hotelsArr = hotelData.hotels.map((hotel, idx) => {
        let price = hotel.priceRange;
        let numericPrice = 0;
        if (typeof price === 'string') {
          const match = price.match(/\d{3,5}/);
          if (match && match.length > 0) {
            numericPrice = parseInt(match[0], 10);
          }
        } else if (typeof price === 'number') {
          numericPrice = price;
        }
        if (!numericPrice || isNaN(numericPrice) || numericPrice < 1500 || numericPrice > 20000) {
          numericPrice = Math.floor(Math.random() * (20000 - 1500 + 1)) + 1500;
        }
        let id = hotel.id || `hotel_${hotel.name?.replace(/\s+/g, '_').toLowerCase() || 'unknown'}_${idx}`;
        return { ...hotel, price: numericPrice, id };
      });
    }
    res.json({
      hotels: hotelsArr,
      locationInsights: hotelData.locationInsights,
      bookingTips: hotelData.bookingTips,
      searchCriteria: req.query,
      totalResults: hotelsArr.length
    });
  } catch (error) {
    console.error('Hotel search error:', error);
    // Fallback: Always return 3 sample hotels if Gemini fails (e.g., 503 error)
    const { location = 'Unknown Location' } = req.query;
    const fallbackImages = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
    ];
    const hotelsArr = Array.from({ length: 3 }).map((_, idx) => {
      const price = Math.floor(Math.random() * (2000 - 1500 + 1)) + 1500;
      return {
        id: `hotel_fallback_${idx}`,
        name: `Sample Hotel ${idx + 1} in ${location}`,
        category: 'mid-range',
        price,
        priceRange: `₹${price}`,
        location: { address: `${location}` },
        amenities: ['Free WiFi', 'Restaurant', 'Bar'],
        pros: ['Good location'],
        cons: ['Limited parking'],
        nearbyAttractions: ['Central Park'],
        rating: 4,
        reviewCount: 10,
        images: [fallbackImages[idx % fallbackImages.length]]
      };
    });
    res.json({
      hotels: hotelsArr,
      locationInsights: '',
      bookingTips: [],
      searchCriteria: req.query,
      totalResults: hotelsArr.length
    });
  }
});

// @route   GET /api/hotels
// @desc    Get all hotels (placeholder, as search is primary)
// @access  Public
router.get('/', async (req, res) => {
  res.json({ message: "Please use /api/hotels/search to find hotels." });
});

// @route   GET /api/hotels/:id
// @desc    Get hotel details (will need adjustment for AI-based data)
// @access  Public
router.get('/:id', async (req, res) => {
  res.status(404).json({ error: 'Fetching a specific hotel by ID is not supported with AI search.' });
});

module.exports = router; 