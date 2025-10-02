const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Debug: Check if the API key is loaded
console.log('Gemini API Key Loaded:', process.env.GEMINI_API_KEY ? `...${process.env.GEMINI_API_KEY.slice(-4)}` : 'Not Found');

// Initialize Gemini AI with the correct model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  // Utility to strip markdown code block formatting
  stripCodeBlock(text) {
    if (!text) return text;
    // Remove triple backticks and optional language, handle both inline and multiline
    return text
      .replace(/```json\s*/g, '')  // Remove opening ```json
      .replace(/```\s*$/g, '')     // Remove closing ```
      .replace(/^```[a-zA-Z]*\n?|```$/g, '')  // Remove any remaining code blocks
      .replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1')  // Handle multiline code blocks
      .trim();
  }

  // Get AI-powered travel recommendations
  async getTravelRecommendations(from, to, date, budget, preferences = {}) {
    try {
      const prompt = `
        As a travel expert, provide detailed recommendations for traveling from ${from} to ${to} on ${date}.
        
        Budget: ${budget}
        Preferences: ${JSON.stringify(preferences)}
        
        Please provide:
        1. Best transportation options (flights, trains, buses) with estimated costs
        2. Recommended hotels in the destination with price ranges
        3. Optimal routing suggestions
        4. Travel tips and considerations
        5. Alternative routes if available
        
        IMPORTANT: Do NOT use any placeholders like [Airline Name], [Time], or [Price]. Always invent plausible airline names (e.g., Air India, IndiGo, Vistara), realistic departure/arrival times (e.g., 09:30, 18:45), and prices (e.g., ₹4500, ₹12000). If you don't know the real data, make up realistic examples.
        
        Example for flights:
        "transportation": [
          {
            "type": "flight",
            "airlineName": "IndiGo",
            "recommendation": "IndiGo flight 6E-123 departs Delhi at 09:30 and arrives in Mumbai at 11:45. Return flight 6E-124 departs Mumbai at 18:00 and arrives in Delhi at 20:15. Round trip, non-stop.",
            "estimatedCost": "₹7,200",
            "duration": "2h 15m",
            "pros": ["Non-stop", "Good on-time record"],
            "cons": ["No free meals"]
          },
          {
            "type": "flight",
            "airlineName": "Air India",
            "recommendation": "Air India flight AI-101 departs Delhi at 13:00 and arrives in Mumbai at 15:20. Return flight AI-102 departs Mumbai at 21:00 and arrives in Delhi at 23:20. Round trip, one layover.",
            "estimatedCost": "₹8,500",
            "duration": "2h 20m",
            "pros": ["Checked baggage included"],
            "cons": ["One layover"]
          }
        ]
        
        Format the response as JSON with the following structure:
        {
          "transportation": [
            {
              "type": "flight/train/bus",
              "recommendation": "description",
              "estimatedCost": "price range",
              "duration": "travel time",
              "pros": ["advantages"],
              "cons": ["disadvantages"],
              "airlineName": "if flight, give a plausible airline name",
              "trainName": "if train, give a plausible train name"
            }
          ],
          "hotels": [
            {
              "name": "hotel name",
              "category": "budget/mid-range/luxury",
              "priceRange": "price range",
              "location": "area description",
              "amenities": ["key features"]
            }
          ],
          "routing": {
            "optimalRoute": "description",
            "alternatives": ["alternative routes"],
            "tips": ["travel tips"]
          },
          "totalEstimatedCost": "total budget estimate"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = this.stripCodeBlock(text);
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          rawResponse: text,
          error: "Could not parse structured response"
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get travel recommendations');
    }
  }

  // Get cost analysis and price predictions
  async getCostAnalysis(from, to, date, transportType) {
    try {
      const prompt = `
        Analyze the cost trends for ${transportType} travel from ${from} to ${to} around ${date}.
        
        Please provide:
        1. Current average prices
        2. Price trends (increasing/decreasing)
        3. Best time to book
        4. Cost-saving tips
        5. Seasonal price variations
        
        Format as JSON:
        {
          "currentPrices": {
            "average": "price",
            "range": "min-max",
            "trend": "increasing/decreasing/stable"
          },
          "bookingAdvice": {
            "bestTimeToBook": "recommendation",
            "pricePrediction": "future trend",
            "tips": ["cost-saving tips"]
          },
          "seasonalFactors": ["factors affecting prices"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = this.stripCodeBlock(text);
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { rawResponse: text };
      }
    } catch (error) {
      console.error('Cost Analysis Error:', error);
      throw new Error('Failed to analyze costs');
    }
  }

  // Get route optimization suggestions
  async getRouteOptimization(from, to, date, constraints = {}) {
    try {
      const prompt = `
        Optimize the travel route from ${from} to ${to} for ${date}.
        
        Constraints: ${JSON.stringify(constraints)}
        
        Consider:
        1. Multiple transportation modes
        2. Time efficiency
        3. Cost optimization
        4. Comfort and convenience
        5. Environmental impact
        
        Provide JSON response:
        {
          "optimalRoutes": [
            {
              "route": "description",
              "transportModes": ["modes used"],
              "totalTime": "duration",
              "totalCost": "estimated cost",
              "comfort": "comfort level",
              "environmentalImpact": "eco-friendliness"
            }
          ],
          "alternatives": ["alternative routes"],
          "recommendations": ["general advice"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = this.stripCodeBlock(text);
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { rawResponse: text };
      }
    } catch (error) {
      console.error('Route Optimization Error:', error);
      throw new Error('Failed to optimize route');
    }
  }

  // Get hotel recommendations with AI insights
  async getHotelRecommendations(location, checkIn, checkOut, guests, budget, preferences = {}) {
    try {
      // Check if API key is available
      if (!process.env.GEMINI_API_KEY) {
        console.error('Gemini API key not found in environment variables');
        throw new Error('Gemini API key not configured');
      }

      const prompt = `
        Recommend hotels in ${location} for ${guests} guests from ${checkIn} to ${checkOut}.
        
        Budget: ${budget}
        Preferences: ${JSON.stringify(preferences)}
        
        Provide:
        1. Hotel recommendations by category (budget, mid-range, luxury)
        2. Location analysis
        3. Amenity recommendations
        4. Booking tips
        5. Local attractions nearby
        
        JSON format:
        {
          "hotels": [
            {
              "name": "hotel name",
              "category": "budget/mid-range/luxury",
              "priceRange": "price range",
              "location": "area description",
              "amenities": ["features"],
              "pros": ["advantages"],
              "cons": ["disadvantages"],
              "nearbyAttractions": ["attractions"]
            }
          ],
          "locationInsights": "area analysis",
          "bookingTips": ["tips for booking"]
        }
      `;

      console.log('Sending prompt to Gemini:', prompt);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = this.stripCodeBlock(text);
      
      console.log('Raw response from Gemini:', text);
      
      try {
        const parsedData = JSON.parse(text);
        console.log('Parsed hotel data:', parsedData);
        return parsedData;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw text that failed to parse:', text);
        return { 
          rawResponse: text,
          error: "Could not parse JSON response from Gemini",
          parseError: parseError.message
        };
      }
    } catch (error) {
      console.error('Hotel Recommendations Error:', error);
      if (error.message.includes('API key')) {
        throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your .env file');
      }
      throw new Error(`Failed to get hotel recommendations: ${error.message}`);
    }
  }

  // Get flight recommendations with AI insights
  async getFlightRecommendations(from, to, date, passengers, travelClass) {
    try {
      const prompt = `
        Provide a list of available flights from ${from} to ${to} on ${date} for ${passengers} passengers in ${travelClass} class.
        
        Provide the response as a JSON array with the following structure for each flight:
        [
          {
            "flightNumber": "string",
            "airline": { "name": "string", "code": "string", "logo": "string_url" },
            "origin": { "airport": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "destination": { "airport": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "departure": { "date": "YYYY-MM-DD", "time": "HH:MM", "terminal": "string", "gate": "string" },
            "arrival": { "date": "YYYY-MM-DD", "time": "HH:MM", "terminal": "string", "gate": "string" },
            "duration": "string",
            "seats": { "economy": { "available": "number", "price": "number" } },
            "totalPrice": "number",
            "currency": "string",
            "cabinClass": "string"
          }
        ]
        
        If no flights are found, return an empty array.
        Just return the JSON array, nothing else.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean the response to ensure it's valid JSON
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        return ensureId(JSON.parse(text), 'flight');
      } catch (parseError) {
        console.error('Flight Recommendations Parse Error:', parseError, 'Raw Text:', text);
        // If JSON parsing fails, return an empty array or some error structure
        return {
          rawResponse: text,
          error: "Could not parse structured response for flights"
        };
      }
    } catch (error) {
      console.error('Flight Recommendations Error:', error);
      throw new Error('Failed to get flight recommendations');
    }
  }

  // Get bus recommendations with AI insights
  async getBusRecommendations(from, to, date, passengers) {
    try {
      const prompt = `
        Provide a list of available buses from ${from} to ${to} on ${date} for ${passengers} passengers.
        
        Provide the response as a JSON array with the following structure for each bus:
        [
          {
            "busNumber": "string",
            "operator": { "name": "string", "logo": "string_url" },
            "origin": { "station": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "destination": { "station": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "departure": { "date": "YYYY-MM-DD", "time": "HH:MM" },
            "arrival": { "date": "YYYY-MM-DD", "time": "HH:MM" },
            "duration": "string",
            "seats": { "sleeper": { "available": "number", "price": "number" }, "seater": { "available": "number", "price": "number" } },
            "totalPrice": "number",
            "currency": "string",
            "busType": "string"
          }
        ]
        
        If no buses are found, return an empty array.
        Just return the JSON array, nothing else.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        return ensureId(JSON.parse(text), 'bus');
      } catch (parseError) {
        console.error('Bus Recommendations Parse Error:', parseError, 'Raw Text:', text);
        return {
          rawResponse: text,
          error: "Could not parse structured response for buses"
        };
      }
    } catch (error) {
      console.error('Bus Recommendations Error:', error);
      throw new Error('Failed to get bus recommendations');
    }
  }

  // Get train recommendations with AI insights
  async getTrainRecommendations(from, to, date, passengers, travelClass) {
    try {
      const prompt = `
        Provide a list of available trains from ${from} to ${to} on ${date} for ${passengers} passengers in ${travelClass} class.
        
        Provide the response as a JSON array with the following structure for each train:
        [
          {
            "trainNumber": "string",
            "trainName": "string",
            "operator": { "name": "string", "logo": "string_url" },
            "origin": { "station": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "destination": { "station": { "code": "string", "name": "string", "city": "string", "country": "string" } },
            "departure": { "date": "YYYY-MM-DD", "time": "HH:MM" },
            "arrival": { "date": "YYYY-MM-DD", "time": "HH:MM" },
            "duration": "number (duration in minutes)",
            "seats": { "ac3": { "available": "number", "price": "number" }, "sleeper": { "available": "number", "price": "number" } },
            "totalPrice": "number",
            "currency": "string",
            "trainType": "string"
          }
        ]
        
        If no trains are found, return an empty array.
        Just return the JSON array, nothing else.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        return ensureId(JSON.parse(text), 'train');
      } catch (parseError) {
        console.error('Train Recommendations Parse Error:', parseError, 'Raw Text:', text);
        return {
          rawResponse: text,
          error: "Could not parse structured response for trains"
        };
      }
    } catch (error) {
      console.error('Train Recommendations Error:', error);
      throw new Error('Failed to get train recommendations');
    }
  }

  // Get travel insights and tips
  async getTravelInsights(from, to, date, travelType) {
    try {
      const prompt = `
        Provide comprehensive travel insights for ${travelType} from ${from} to ${to} on ${date}.
        
        Include:
        1. Weather considerations
        2. Local customs and etiquette
        3. Safety tips
        4. Packing recommendations
        5. Documentation requirements
        6. Currency and payment methods
        7. Language considerations
        
        JSON format:
        {
          "weather": "weather information",
          "localCustoms": ["customs to know"],
          "safety": ["safety tips"],
          "packing": ["packing list"],
          "documentation": ["required documents"],
          "currency": "currency information",
          "language": "language considerations"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { rawResponse: text };
      }
    } catch (error) {
      console.error('Travel Insights Error:', error);
      throw new Error('Failed to get travel insights');
    }
  }

  // Get chatbot response
  async getChatbotResponse(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { rawResponse: text };
      }
    } catch (error) {
      console.error('Chatbot Error:', error);
      throw new Error('Failed to get chatbot response');
    }
  }
}

function ensureId(arr, type) {
  return (arr || []).map(item => ({
    ...item,
    id: item.id || `${type}_${item.trainNumber || item.flightNumber || item.busNumber || Math.random().toString(36).substr(2, 9)}`
  }));
}

module.exports = GeminiService; 