import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Users, Play, Plus } from 'lucide-react';

const HomePage = () => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!nickname.trim()) return;
    
    setIsCreating(true);
    try {
      console.log('Creating room...');
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Room created:', data);
      navigate(`/room/${data.roomId}?nickname=${encodeURIComponent(nickname)}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = () => {
    if (!roomId.trim() || !nickname.trim()) return;
    navigate(`/room/${roomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 text-campfire-500 animate-flicker" />
            <h1 className="text-4xl font-bold text-white ml-3">Campfire</h1>
          </div>
          <p className="text-gray-300 text-lg">Share movies with friends in real-time</p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-8"
        >
          {/* Nickname Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-campfire-500 focus:border-transparent"
            />
          </div>

          {/* Create Room */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6"
          >
            <button
              onClick={createRoom}
              disabled={!nickname.trim() || isCreating}
              className="w-full campfire-gradient text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span>{isCreating ? 'Creating...' : 'Create New Room'}</span>
            </button>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Join Room */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-campfire-500 focus:border-transparent"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={joinRoom}
                disabled={!roomId.trim() || !nickname.trim()}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users className="w-5 h-5" />
                <span>Join Room</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-campfire-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 text-campfire-500" />
            </div>
            <h3 className="text-white font-semibold">Real-time Sync</h3>
            <p className="text-gray-400 text-sm">Watch together in perfect sync</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-campfire-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-campfire-500" />
            </div>
            <h3 className="text-white font-semibold">P2P Streaming</h3>
            <p className="text-gray-400 text-sm">Direct peer-to-peer video sharing</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-campfire-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6 text-campfire-500" />
            </div>
            <h3 className="text-white font-semibold">Local Hosting</h3>
            <p className="text-gray-400 text-sm">No cloud storage needed</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage; 