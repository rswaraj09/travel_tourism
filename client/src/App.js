import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ChatbotProvider } from './contexts/ChatbotContext';

// Components
import Footer from './components/layout/Footer';
import Chatbot from './components/chatbot/Chatbot';

// Pages
import Home from './pages/Home';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Packages from './pages/Packages';
import Buses from './pages/Buses';
import Trains from './pages/Trains';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Bookings from './pages/Bookings';
import BookingDetails from './pages/BookingDetails';
import Payment from './pages/Payment';
import SearchResults from './pages/SearchResults';
import Destination from './pages/Destination';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AITravelSearch from './components/ai-travel/AITravelSearch';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatbotProvider>
          <div className="min-h-screen bg-gray-50">
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/flights" element={<Flights />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/buses" element={<Buses />} />
                <Route path="/trains" element={<Trains />} />
                <Route path="/ai-travel" element={<AITravelSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/destination/:id" element={<Destination />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/bookings" 
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/booking/:type/:id" 
                  element={
                    <ProtectedRoute>
                      <BookingDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment/:id" 
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </ChatbotProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 