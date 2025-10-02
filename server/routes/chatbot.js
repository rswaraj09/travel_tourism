const express = require('express');
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();
const auth = require('../middleware/auth');

const router = express.Router();

// Travel context for the AI
const travelContext = `
You are a helpful travel assistant for a travel and tourism website. You can help users with:

1. Flight bookings and information
2. Hotel recommendations and bookings
3. Holiday package suggestions
4. Bus and train bookings
5. Travel itinerary planning
6. Destination information and tips
7. Travel requirements and documentation
8. Booking modifications and cancellations
9. Customer support issues

Always be friendly, professional, and provide accurate information. If you don't know something specific about our services, suggest contacting customer support.

Current services available:
- Flights: Domestic and international flights with multiple airlines
- Hotels: Hotels worldwide with various star ratings and amenities
- Packages: All-inclusive holiday packages
- Buses: Inter-city and local bus services
- Trains: Domestic and international train bookings
- Car Rentals: Available at major destinations
- Travel Insurance: Comprehensive coverage options

Booking process:
1. Search for availability
2. Select preferred options
3. Enter passenger details
4. Choose payment method
5. Confirm booking

Payment methods: Credit/Debit cards, UPI, Net Banking, Digital Wallets
`;

// @route   POST /api/chatbot/chat
// @desc    Chat with AI travel assistant
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], userId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare conversation context
    let conversationContext = travelContext;
    
    if (conversationHistory.length > 0) {
      conversationContext += '\n\nPrevious conversation:\n';
      conversationHistory.forEach((msg, index) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    // Add user context if available
    if (userId) {
      conversationContext += '\n\nUser is logged in and can access personalized features.';
    }

    // Use Gemini for chat completion
    const aiResponseObj = await geminiService.getChatbotResponse(conversationContext + '\nUser: ' + message);
    let aiResponse = '';
    if (typeof aiResponseObj === 'string') {
      aiResponse = aiResponseObj;
    } else if (aiResponseObj.rawResponse) {
      aiResponse = aiResponseObj.rawResponse;
    } else if (aiResponseObj.message) {
      aiResponse = aiResponseObj.message;
    } else {
      aiResponse = JSON.stringify(aiResponseObj);
    }

    // Check for specific intents and provide structured responses
    const intent = await detectIntent(message.toLowerCase());
    
    let structuredResponse = {
      message: aiResponse,
      intent: intent.type,
      confidence: intent.confidence,
      suggestions: [],
      quickActions: []
    };

    // Add suggestions based on intent
    switch (intent.type) {
      case 'flight_search':
        structuredResponse.suggestions = [
          'Search for flights',
          'Check flight status',
          'Book a flight',
          'Flight schedules'
        ];
        structuredResponse.quickActions = [
          { text: 'Search Flights', action: 'search_flights' },
          { text: 'Flight Status', action: 'flight_status' }
        ];
        break;
      
      case 'hotel_search':
        structuredResponse.suggestions = [
          'Search for hotels',
          'Hotel reviews',
          'Book a hotel',
          'Hotel amenities'
        ];
        structuredResponse.quickActions = [
          { text: 'Search Hotels', action: 'search_hotels' },
          { text: 'Hotel Reviews', action: 'hotel_reviews' }
        ];
        break;
      
      case 'package_search':
        structuredResponse.suggestions = [
          'Holiday packages',
          'All-inclusive deals',
          'Custom packages',
          'Package reviews'
        ];
        structuredResponse.quickActions = [
          { text: 'View Packages', action: 'view_packages' },
          { text: 'Custom Package', action: 'custom_package' }
        ];
        break;
      
      case 'booking_help':
        structuredResponse.suggestions = [
          'How to book',
          'Payment methods',
          'Booking confirmation',
          'Modify booking'
        ];
        structuredResponse.quickActions = [
          { text: 'Booking Guide', action: 'booking_guide' },
          { text: 'My Bookings', action: 'my_bookings' }
        ];
        break;
      
      case 'customer_support':
        structuredResponse.suggestions = [
          'Contact support',
          'FAQ',
          'Live chat',
          'Email support'
        ];
        structuredResponse.quickActions = [
          { text: 'Contact Support', action: 'contact_support' },
          { text: 'FAQ', action: 'faq' }
        ];
        break;
      
      default:
        structuredResponse.suggestions = [
          'Search flights',
          'Search hotels',
          'Holiday packages',
          'Customer support'
        ];
        structuredResponse.quickActions = [
          { text: 'Search Flights', action: 'search_flights' },
          { text: 'Search Hotels', action: 'search_hotels' }
        ];
    }

    res.json(structuredResponse);

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Fallback response if AI service is unavailable
    res.json({
      message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our customer support for immediate assistance.",
      intent: 'error',
      confidence: 0,
      suggestions: ['Contact Support', 'Try Again', 'Search Manually'],
      quickActions: [
        { text: 'Contact Support', action: 'contact_support' },
        { text: 'Search Flights', action: 'search_flights' }
      ]
    });
  }
});

// @route   POST /api/chatbot/feedback
// @desc    Submit feedback for chatbot responses
// @access  Public
router.post('/feedback', async (req, res) => {
  try {
    const { message, response, rating, feedback, userId } = req.body;

    // In a real application, you would store this feedback in a database
    // for improving the chatbot responses
    
    console.log('Chatbot feedback:', {
      message,
      response,
      rating,
      feedback,
      userId,
      timestamp: new Date()
    });

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Intent detection function
async function detectIntent(message) {
  const intents = [
    {
      type: 'flight_search',
      keywords: ['flight', 'fly', 'airline', 'airport', 'departure', 'arrival', 'booking flight'],
      confidence: 0.8
    },
    {
      type: 'hotel_search',
      keywords: ['hotel', 'accommodation', 'room', 'stay', 'lodging', 'book hotel'],
      confidence: 0.8
    },
    {
      type: 'package_search',
      keywords: ['package', 'holiday', 'vacation', 'tour', 'trip', 'all inclusive'],
      confidence: 0.8
    },
    {
      type: 'booking_help',
      keywords: ['book', 'booking', 'reservation', 'confirm', 'payment', 'how to book'],
      confidence: 0.7
    },
    {
      type: 'customer_support',
      keywords: ['help', 'support', 'issue', 'problem', 'complaint', 'contact'],
      confidence: 0.9
    },
    {
      type: 'general_inquiry',
      keywords: ['what', 'how', 'when', 'where', 'why', 'information'],
      confidence: 0.6
    }
  ];

  let bestIntent = { type: 'general_inquiry', confidence: 0.5 };

  for (const intent of intents) {
    const keywordMatches = intent.keywords.filter(keyword => 
      message.includes(keyword)
    ).length;
    
    if (keywordMatches > 0) {
      const confidence = Math.min(intent.confidence * keywordMatches, 0.95);
      if (confidence > bestIntent.confidence) {
        bestIntent = { type: intent.type, confidence };
      }
    }
  }

  return bestIntent;
}

module.exports = router; 