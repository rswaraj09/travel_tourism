# Gemini API Integration Setup Guide

## Overview
This travel booking application now includes AI-powered features using Google's Gemini API for intelligent travel recommendations, cost analysis, and route optimization.

## Features Added

### 1. AI-Powered Travel Search
- **Intelligent Recommendations**: Get AI-powered suggestions for flights, trains, and hotels
- **Cost Analysis**: AI-driven price predictions and cost-saving tips
- **Route Optimization**: Smart routing suggestions considering multiple factors
- **Travel Insights**: Weather, customs, safety tips, and more

### 2. Enhanced Search Results
- **Combined Transport View**: Always shows both flights and trains
- **AI Recommendations**: Contextual suggestions based on your preferences
- **Cost Trends**: Price analysis and booking advice

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel-tourism

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000

# Gemini AI Configuration
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Other API Keys (if needed)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 3. Install Dependencies
The Gemini SDK has already been installed. If you need to reinstall:

```bash
cd server
npm install @google/generative-ai
```

### 4. Start the Application
```bash
# Start the server
cd server
npm start

# Start the client (in a new terminal)
cd client
npm start
```

## API Endpoints

### AI Travel Services
- `POST /api/ai-travel/recommendations` - Get travel recommendations
- `POST /api/ai-travel/cost-analysis` - Get cost analysis
- `POST /api/ai-travel/route-optimization` - Get route optimization
- `POST /api/ai-travel/hotel-recommendations` - Get hotel recommendations
- `POST /api/ai-travel/insights` - Get travel insights
- `POST /api/ai-travel/comprehensive-search` - Get all AI recommendations

### Example Request
```javascript
const response = await fetch('/api/ai-travel/comprehensive-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'New York',
    to: 'London',
    date: '2024-03-15',
    budget: 'mid-range',
    includeHotels: true
  })
});
```

## Usage

### 1. Access AI Travel Search
- Navigate to `/ai-travel` in your application
- Or click "AI Travel" in the navigation menu

### 2. Enhanced Regular Search
- The regular search now always shows both flights and trains
- New "All Transport" tab shows combined results
- AI recommendations are integrated into search results

### 3. AI Features
- **Smart Recommendations**: AI suggests the best transport options
- **Cost Predictions**: Get price trends and booking advice
- **Route Optimization**: Find the most efficient routes
- **Travel Insights**: Weather, customs, and safety information

## Features Breakdown

### Transportation Recommendations
- Flight, train, and bus suggestions
- Pros and cons for each option
- Estimated costs and durations
- Personalized recommendations based on preferences

### Cost Analysis
- Current price trends
- Best time to book
- Cost-saving tips
- Seasonal price variations

### Route Optimization
- Multi-modal transport suggestions
- Time and cost optimization
- Comfort and environmental considerations
- Alternative route options

### Hotel Recommendations
- AI-powered hotel suggestions
- Location analysis
- Amenity recommendations
- Nearby attractions

### Travel Insights
- Weather considerations
- Local customs and etiquette
- Safety tips
- Packing recommendations
- Documentation requirements

## Error Handling
The application includes comprehensive error handling for:
- API key issues
- Network errors
- Invalid requests
- Rate limiting

## Security Notes
- Never commit your actual API key to version control
- Use environment variables for sensitive data
- Implement rate limiting for production use
- Consider API usage costs and limits

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure your Gemini API key is correctly set in the `.env` file
2. **CORS Issues**: Check that the client URL is correctly configured
3. **Network Errors**: Verify the server is running and accessible

### Debug Mode
To enable debug logging, set `NODE_ENV=development` in your `.env` file.

## Cost Considerations
- Gemini API has usage-based pricing
- Monitor your API usage in the Google AI Studio dashboard
- Consider implementing caching for repeated requests
- Set up usage alerts to avoid unexpected charges

## Future Enhancements
- Real-time price monitoring
- Predictive booking recommendations
- Personalized travel itineraries
- Multi-language support
- Integration with more travel APIs 