import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './components/HomePage';
import MovieRoom from './components/MovieRoom';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<MovieRoom />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App; 