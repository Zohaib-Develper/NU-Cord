import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const socketRef = useRef(null);

  // Connect socket globally
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:8000', {
        autoConnect: false,
        transports: ['websocket'],
      });
    }
    const socket = socketRef.current;
    if (user && user._id) {
      if (!socket.connected) socket.connect();
      socket.emit('registerUser', user._id);
    }
    // Re-register on reconnect
    const handleConnect = () => {
      if (user && user._id) {
        socket.emit('registerUser', user._id);
      }
    };
    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user]);

  // Listen for incoming call events globally
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handleIncomingCall = ({ from, offer, type }) => {
      setIncomingCall({ from, offer, type });
    };
    socket.on('incomingCall', handleIncomingCall);
    return () => {
      socket.off('incomingCall', handleIncomingCall);
    };
  }, []);

  // Accept/decline call helpers
  const clearIncomingCall = () => setIncomingCall(null);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      incomingCall,
      setIncomingCall,
      clearIncomingCall,
      callActive,
      setCallActive,
    }}>
      {children}
    </SocketContext.Provider>
  );
}; 