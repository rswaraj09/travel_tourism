import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaRobot,
  FaUser,
  FaThumbsUp,
  FaThumbsDown,
  FaTrash
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const { 
    isOpen, 
    messages, 
    loading, 
    openChat, 
    closeChat, 
    sendMessage, 
    handleQuickAction,
    clearMessages 
  } = useChatbot();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleQuickActionClick = (action) => {
    handleQuickAction(action);
  };

  const handleFeedback = (messageId, rating) => {
    setShowFeedback(messageId);
    toast.success('Thank you for your feedback!');
  };

  const handleClearChat = () => {
    clearMessages();
    toast.success('Chat history cleared');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={openChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComments className="text-xl" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="w-[80vw] h-[80vh] max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <FaRobot className="text-xl" />
                  <div>
                    <h3 className="font-semibold">AI Travel Assistant</h3>
                    <p className="text-xs opacity-90">Powered by AI</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClearChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Clear chat"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white ml-2' 
                          : 'bg-gray-200 text-gray-600 mr-2'
                      }`}>
                        {message.role === 'user' ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
                      </div>

                      {/* Message Content */}
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {/* Render AI recommendations if present */}
                          {message.aiData && (
                            <div className="mt-2">
                              <h4 className="font-semibold mb-1">AI Journey Recommendations</h4>
                              {message.aiData.transportation && (
                                <div className="mb-2">
                                  <h5 className="font-medium">Transportation</h5>
                                  {message.aiData.transportation.map((t, i) => (
                                    <div key={i} className="mb-1 p-1 border rounded">
                                      <strong className="capitalize">{t.type}</strong>: {t.recommendation}<br/>
                                      <span className="text-xs">Cost: {t.estimatedCost} | Duration: {t.duration}</span>
                                      <div className="text-xs">Pros: {t.pros?.join(', ')}</div>
                                      <div className="text-xs">Cons: {t.cons?.join(', ')}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {message.aiData.hotels && (
                                <div className="mb-2">
                                  <h5 className="font-medium">Hotels</h5>
                                  {message.aiData.hotels.map((h, i) => (
                                    <div key={i} className="mb-1 p-1 border rounded">
                                      <strong>{h.name}</strong> ({h.category})<br/>
                                      <span className="text-xs">{h.location} | {h.priceRange}</span>
                                      <div className="text-xs">Amenities: {h.amenities?.join(', ')}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {message.aiData.routing && (
                                <div className="mb-2">
                                  <h5 className="font-medium">Routing & Tips</h5>
                                  <div className="text-xs"><strong>Optimal Route:</strong> {message.aiData.routing.optimalRoute}</div>
                                  <div className="text-xs"><strong>Alternatives:</strong> {message.aiData.routing.alternatives?.join('; ')}</div>
                                  <div className="text-xs"><strong>Tips:</strong> {message.aiData.routing.tips?.join('; ')}</div>
                                </div>
                              )}
                              {message.aiData.totalEstimatedCost && (
                                <div className="mb-2 text-xs"><strong>Total Estimated Cost:</strong> {message.aiData.totalEstimatedCost}</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Message Time */}
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </span>

                        {/* Quick Actions */}
                        {message.role === 'bot' && message.quickActions && message.quickActions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.quickActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickActionClick(action)}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                              >
                                {action.text}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Suggestions */}
                        {message.role === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => sendMessage(suggestion)}
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Feedback */}
                        {message.role === 'bot' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Helpful"
                            >
                              <FaThumbsUp className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Not helpful"
                            >
                              <FaThumbsDown className="text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaRobot className="text-sm text-gray-600" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 