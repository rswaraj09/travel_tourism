import React, { createContext, useContext, useReducer, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ChatbotContext = createContext();

const initialState = {
  isOpen: false,
  messages: [],
  loading: false,
  error: null
};

const initialFormState = {
  budget: '',
  destination: '',
  origin: '',
  people: '',
  departure: '',
  return: ''
};

const chatbotReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_CHAT':
      return {
        ...state,
        isOpen: true
      };
    case 'CLOSE_CHAT':
      return {
        ...state,
        isOpen: false
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const ChatbotProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const [conversationHistory, setConversationHistory] = useState([]);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);

  const stepQuestions = [
    {
      key: 'budget',
      question: 'What is your total journey budget (in ₹)?',
      quickActions: [
        { text: '₹10,000', action: 'budget_10000' },
        { text: '₹20,000', action: 'budget_20000' },
        { text: '₹30,000', action: 'budget_30000' },
        { text: '₹50,000+', action: 'budget_50000' }
      ]
    },
    { key: 'destination', question: 'Where do you want to travel?' },
    { key: 'origin', question: 'Where are you traveling from?' },
    { key: 'people', question: 'How many people are traveling?' },
    { key: 'departure', question: 'What is your departure date? (YYYY-MM-DD)' },
    { key: 'return', question: 'What is your return date? (YYYY-MM-DD)' }
  ];

  const startFormFlow = () => {
    setFormStep(0);
    setFormData(initialFormState);
    dispatch({ type: 'CLEAR_MESSAGES' });
    askNextStep(0, initialFormState);
  };

  const askNextStep = (step, data) => {
    const q = stepQuestions[step];
    if (!q) return;
    const botMsg = {
      id: Date.now(),
      role: 'bot',
      content: q.question,
      timestamp: new Date(),
      suggestions: [],
      quickActions: q.quickActions || []
    };
    dispatch({ type: 'ADD_MESSAGE', payload: botMsg });
  };

  const handleFormStep = async (input) => {
    const key = stepQuestions[formStep].key;
    const newData = { ...formData, [key]: input };
    setFormData(newData);
    if (formStep < stepQuestions.length - 1) {
      setFormStep(formStep + 1);
      askNextStep(formStep + 1, newData);
    } else {
      // All data collected, send to backend
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await axios.post('/api/chatbot/chat', {
          message: `Find me travel options with this info: ${JSON.stringify(newData)}`,
          conversationHistory: [],
          userId: isAuthenticated ? user?.id : null
        });
        const botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: response.data.message,
          timestamp: new Date(),
          suggestions: response.data.suggestions || [],
          quickActions: response.data.quickActions || [],
          intent: response.data.intent,
          confidence: response.data.confidence
        };
        dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our customer support for immediate assistance.",
          timestamp: new Date(),
          suggestions: ['Try Again', 'Contact Support'],
          quickActions: [
            { text: 'Contact Support', action: 'contact_support' }
          ]
        };
        dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
        dispatch({ type: 'SET_ERROR', payload: 'Failed to get response' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        setFormStep(0);
        setFormData(initialFormState);
      }
    }
  };

  const openChat = () => {
    dispatch({ type: 'OPEN_CHAT' });
    if (state.messages.length === 0) {
      startFormFlow();
    }
  };

  const closeChat = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    if (formStep < stepQuestions.length) {
      // In form flow, handle step
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      handleFormStep(message);
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    // Update conversation history
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);

    try {
      const response = await axios.post('/api/chatbot/chat', {
        message,
        conversationHistory: updatedHistory.slice(-10), // Keep last 10 messages for context
        userId: isAuthenticated ? user?.id : null
      });

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: response.data.message,
        timestamp: new Date(),
        suggestions: response.data.suggestions || [],
        quickActions: response.data.quickActions || [],
        intent: response.data.intent,
        confidence: response.data.confidence
      };

      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
      setConversationHistory([...updatedHistory, botMessage]);

      // Handle quick actions
      if (response.data.quickActions && response.data.quickActions.length > 0) {
        handleQuickActions(response.data.quickActions);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our customer support for immediate assistance.",
        timestamp: new Date(),
        suggestions: ['Try Again', 'Contact Support'],
        quickActions: [
          { text: 'Contact Support', action: 'contact_support' }
        ]
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get response' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleQuickAction = (action) => {
    let message = '';
    
    switch (action.action) {
      case 'budget_10000':
      case 'budget_20000':
      case 'budget_30000':
      case 'budget_50000': {
        const budget = action.text.replace(/[^\d]/g, '');
        message = `My total journey budget is ₹${budget}`;
        sendMessage(message);
        // After sending, fetch AI recommendations for this budget
        fetchAIRecommendations(budget);
        return;
      }
      case 'search_flights':
        message = 'I can help you search for flights. Please tell me your departure city, destination, and travel dates.';
        break;
      case 'search_hotels':
        message = 'I can help you find hotels. Please tell me your destination, check-in and check-out dates, and number of guests.';
        break;
      case 'view_packages':
        message = 'I can show you our holiday packages. What type of vacation are you looking for? (beach, mountain, city, adventure, etc.)';
        break;
      case 'booking_guide':
        message = 'Here\'s how to book with us: 1) Search for your preferred service, 2) Select your options, 3) Enter passenger details, 4) Choose payment method, 5) Confirm booking.';
        break;
      case 'my_bookings':
        message = 'To view your bookings, please log in to your account and visit the "My Bookings" section.';
        break;
      case 'contact_support':
        message = 'You can contact our support team at support@traveltourism.com or call us at +1-800-TRAVEL. We\'re available 24/7 to help you.';
        break;
      case 'faq':
        message = 'You can find answers to common questions in our FAQ section. What specific information are you looking for?';
        break;
      default:
        message = 'I can help you with that. Please provide more details about what you need.';
    }

    sendMessage(message);
  };

  const handleQuickActions = (actions) => {
    // Auto-handle certain actions
    actions.forEach(action => {
      if (action.action === 'search_flights' || action.action === 'search_hotels') {
        // These will be handled by user interaction
        return;
      }
    });
  };

  // New: fetch AI recommendations for a given budget
  const fetchAIRecommendations = async (budget) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // For demo, use fixed from/to/dates; in real app, ask user for these
      const response = await axios.post('/api/ai-travel/comprehensive-search', {
        from: 'Delhi',
        to: 'Mumbai',
        date: new Date().toISOString().slice(0, 10),
        budget: `₹${budget}`
      });
      const aiData = response.data.data;
      const aiMessage = {
        id: Date.now() + 2,
        role: 'bot',
        content: 'Here are the best journey options for your budget:',
        timestamp: new Date(),
        aiData
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    } catch (error) {
      dispatch({ type: 'ADD_MESSAGE', payload: {
        id: Date.now() + 2,
        role: 'bot',
        content: 'Sorry, I could not fetch recommendations for your budget. Please try again.',
        timestamp: new Date()
      }});
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitFeedback = async (messageId, rating, feedback) => {
    try {
      const message = state.messages.find(m => m.id === messageId);
      await axios.post('/api/chatbot/feedback', {
        message: message?.content,
        response: message?.content,
        rating,
        feedback,
        userId: isAuthenticated ? user?.id : null
      });
      toast.success('Feedback submitted successfully!');
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    setConversationHistory([]);
  };

  const value = {
    isOpen: state.isOpen,
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    openChat,
    closeChat,
    sendMessage,
    handleQuickAction,
    submitFeedback,
    clearMessages
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}; 