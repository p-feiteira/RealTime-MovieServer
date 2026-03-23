import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { MessageCircle, Send } from 'lucide-react';

const Chat = ({ roomId, nickname }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', ({ message, nickname: senderNickname, timestamp }) => {
      setMessages(prev => [...prev, { message, nickname: senderNickname, timestamp }]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('chatMessage', { roomId, message: newMessage, nickname });
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-96 flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-campfire-500" />
        <h3 className="text-white font-semibold">Chat</h3>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.nickname === nickname ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs ${msg.nickname === nickname ? 'bg-campfire-500' : 'bg-white/10'} rounded-lg p-3`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-white">
                  {msg.nickname}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-white text-sm">{msg.message}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-campfire-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="control-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat; 