import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: false
    });

    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('booking-status-changed', (data) => {
      toast.success(`Booking status updated: ${data.status}`);
    });

    newSocket.on('new-message', (data) => {
      toast.success('New message received');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && isAuthenticated && user) {
      // Connect to socket when user is authenticated
      socket.connect();
      
      // Join user's personal room
      socket.emit('join-user', user.id);
    } else if (socket && !isAuthenticated) {
      // Disconnect when user logs out
      socket.disconnect();
    }
  }, [socket, isAuthenticated, user]);

  const emitBookingUpdate = (data) => {
    if (socket && isConnected) {
      socket.emit('booking-update', data);
    }
  };

  const emitChatMessage = (data) => {
    if (socket && isConnected) {
      socket.emit('chat-message', data);
    }
  };

  const value = {
    socket,
    isConnected,
    emitBookingUpdate,
    emitChatMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 