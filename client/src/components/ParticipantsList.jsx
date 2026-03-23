import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, User } from 'lucide-react';

const ParticipantsList = ({ participants }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-campfire-500" />
        <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
      </div>
      
      <div className="space-y-2">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              {participant.isHost ? (
                <Crown className="w-4 h-4 text-campfire-500" />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-white font-medium">
                {participant.nickname}
              </span>
            </div>
            
            {participant.isHost && (
              <span className="text-xs text-campfire-500 bg-campfire-500/20 px-2 py-1 rounded">
                Host
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList; 