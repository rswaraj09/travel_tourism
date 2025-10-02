const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

// @route   POST /api/ai-travel/recommendations
// @desc    Get AI-powered travel recommendations
// @access  Public
router.post('/recommendations', async (req, res) => {
  try {
    const { from, to, date, budget, preferences } = req.body;
    
    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, to, and date are required' });
    }

    const recommendations = await geminiService.getTravelRecommendations(
      from, 
      to, 
      date, 
      budget || 'flexible', 
      preferences || {}
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('AI Travel Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to get travel recommendations' });
  }
});

// @route   POST /api/ai-travel/cost-analysis
// @desc    Get cost analysis and price predictions
// @access  Public
router.post('/cost-analysis', async (req, res) => {
  try {
    const { from, to, date, transportType } = req.body;
    
    if (!from || !to || !date || !transportType) {
      return res.status(400).json({ error: 'From, to, date, and transport type are required' });
    }

    const costAnalysis = await geminiService.getCostAnalysis(from, to, date, transportType);

    res.json({
      success: true,
      data: costAnalysis
    });
  } catch (error) {
    console.error('Cost Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze costs' });
  }
});

// @route   POST /api/ai-travel/route-optimization
// @desc    Get route optimization suggestions
// @access  Public
router.post('/route-optimization', async (req, res) => {
  try {
    const { from, to, date, constraints } = req.body;
    
    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, to, and date are required' });
    }

    const optimization = await geminiService.getRouteOptimization(
      from, 
      to, 
      date, 
      constraints || {}
    );

    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    console.error('Route Optimization Error:', error);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

// @route   POST /api/ai-travel/hotel-recommendations
// @desc    Get AI-powered hotel recommendations
// @access  Public
router.post('/hotel-recommendations', async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests, budget, preferences } = req.body;
    
    if (!location || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: 'Location, check-in, check-out, and guests are required' });
    }

    const hotelRecommendations = await geminiService.getHotelRecommendations(
      location,
      checkIn,
      checkOut,
      guests,
      budget || 'flexible',
      preferences || {}
    );

    res.json({
      success: true,
      data: hotelRecommendations
    });
  } catch (error) {
    console.error('Hotel Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to get hotel recommendations' });
  }
});

// @route   POST /api/ai-travel/insights
// @desc    Get travel insights and tips
// @access  Public
router.post('/insights', async (req, res) => {
  try {
    const { from, to, date, travelType } = req.body;
    
    if (!from || !to || !date || !travelType) {
      return res.status(400).json({ error: 'From, to, date, and travel type are required' });
    }

    const insights = await geminiService.getTravelInsights(from, to, date, travelType);

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Travel Insights Error:', error);
    res.status(500).json({ error: 'Failed to get travel insights' });
  }
});

// @route   POST /api/ai-travel/comprehensive-search
// @desc    Get comprehensive AI-powered search results
// @access  Public
router.post('/comprehensive-search', async (req, res) => {
  try {
    const { from, to, date, budget, preferences, includeHotels } = req.body;
    
    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, to, and date are required' });
    }

    // Get travel recommendations
    const travelRecommendations = await geminiService.getTravelRecommendations(
      from, to, date, budget || 'flexible', preferences || {}
    );

    // Get cost analysis for different transport types
    const flightCostAnalysis = await geminiService.getCostAnalysis(from, to, date, 'flight');
    const trainCostAnalysis = await geminiService.getCostAnalysis(from, to, date, 'train');

    // Get route optimization
    const routeOptimization = await geminiService.getRouteOptimization(from, to, date);

    // Get travel insights
    const travelInsights = await geminiService.getTravelInsights(from, to, date, 'general');

    // Get hotel recommendations if requested
    let hotelRecommendations = null;
    if (includeHotels) {
      hotelRecommendations = await geminiService.getHotelRecommendations(
        to, // destination as location
        date, // check-in date
        date, // check-out date (you might want to calculate this)
        1, // default guests
        budget || 'flexible'
      );
    }

    res.json({
      success: true,
      data: {
        travelRecommendations,
        costAnalysis: {
          flights: flightCostAnalysis,
          trains: trainCostAnalysis
        },
        routeOptimization,
        travelInsights,
        hotelRecommendations
      }
    });
  } catch (error) {
    console.error('Comprehensive Search Error:', error);
    res.status(500).json({ error: 'Failed to get comprehensive search results' });
  }
});

module.exports = router; 