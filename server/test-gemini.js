const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Test script for Gemini API integration
async function testGeminiAPI() {
  console.log('=== Gemini API Test ===');
  
  // Check if API key is loaded
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please create a .env file in the server directory with:');
    console.log('GEMINI_API_KEY=your-actual-gemini-api-key-here');
    return;
  }
  
  console.log('✅ GEMINI_API_KEY found:', `...${process.env.GEMINI_API_KEY.slice(-4)}`);
  
  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log('✅ Gemini model initialized');
    
    // Test with a simple prompt
    const testPrompt = 'Hello, can you respond with a simple JSON object: {"status": "working", "message": "Gemini API is connected"}';
    
    console.log('📤 Sending test prompt...');
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Response received:', text);
    
    // Clean the response (remove markdown code blocks)
    const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
    console.log('🧹 Cleaned response:', cleanText);
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(cleanText);
      console.log('✅ JSON parsed successfully:', jsonResponse);
    } catch (parseError) {
      console.log('⚠️  Response is not valid JSON, but API is working');
      console.log('Parse error:', parseError.message);
    }
    
    console.log('✅ Gemini API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('💡 Make sure your API key is valid and has the correct permissions');
    } else if (error.message.includes('quota')) {
      console.log('💡 You may have exceeded your API quota');
    } else if (error.message.includes('network')) {
      console.log('💡 Check your internet connection');
    }
  }
}

// Run the test
testGeminiAPI(); 