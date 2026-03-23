import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import VideoPlayer from './VideoPlayer';
import ParticipantsList from './ParticipantsList';
import Chat from './Chat';
import { ArrowLeft, Upload, Users, MessageCircle } from 'lucide-react';
import SimplePeer from 'simple-peer';

const MovieRoom = () => {
  const { roomId } = useParams();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get('nickname') || 'Guest';
  
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    videoUrl: null
  });
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [peers, setPeers] = useState(new Map());
  const [videoFile, setVideoFile] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room
    socket.emit('joinRoom', { roomId, nickname });

    // Listen for room events
    socket.on('roomJoined', (data) => {
      setRoomData(data);
      setParticipants(data.participants);
      setIsHost(data.isHost);
      setVideoState(data.videoState);
    });

    socket.on('participantJoined', ({ participant }) => {
      setParticipants(prev => [...prev, participant]);
    });

    socket.on('participantLeft', ({ participantId }) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      // Clean up peer connection
      if (peers.has(participantId)) {
        peers.get(participantId).destroy();
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(participantId);
          return newPeers;
        });
      }
    });

    socket.on('hostDisconnected', () => {
      alert('Host has disconnected. Session ended.');
      navigate('/');
    });

    // Video sync events
    socket.on('videoPlay', ({ currentTime }) => {
      if (videoRef.current && !isHost) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
    });

    socket.on('videoPause', ({ currentTime }) => {
      if (videoRef.current && !isHost) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.pause();
      }
    });

    socket.on('videoSeek', ({ currentTime }) => {
      if (videoRef.current && !isHost) {
        videoRef.current.currentTime = currentTime;
      }
    });

    socket.on('videoLoaded', ({ duration, videoUrl }) => {
      setVideoState(prev => ({ ...prev, duration, videoUrl }));
    });

    // WebRTC signaling
    socket.on('offer', ({ offer, from }) => {
      handleOffer(offer, from);
    });

    socket.on('answer', ({ answer, from }) => {
      handleAnswer(answer, from);
    });

    socket.on('iceCandidate', ({ candidate, from }) => {
      handleIceCandidate(candidate, from);
    });

    return () => {
      socket.off('roomJoined');
      socket.off('participantJoined');
      socket.off('participantLeft');
      socket.off('hostDisconnected');
      socket.off('videoPlay');
      socket.off('videoPause');
      socket.off('videoSeek');
      socket.off('videoLoaded');
      socket.off('offer');
      socket.off('answer');
      socket.off('iceCandidate');
    };
  }, [socket, isConnected, roomId, nickname, isHost, peers, navigate]);

  const handleOffer = async (offer, from) => {
    try {
      const peer = new SimplePeer({
        initiator: false,
        trickle: false
      });

      peer.on('signal', (data) => {
        socket.emit('answer', { roomId, answer: data, targetId: from });
      });

      peer.on('stream', (stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

      peer.signal(offer);
      setPeers(prev => new Map(prev).set(from, peer));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = (answer, from) => {
    const peer = peers.get(from);
    if (peer) {
      peer.signal(answer);
    }
  };

  const handleIceCandidate = (candidate, from) => {
    const peer = peers.get(from);
    if (peer) {
      peer.signal(candidate);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoState(prev => ({ ...prev, videoUrl: url }));
      
      // Notify others about new video
      socket.emit('videoLoaded', { 
        roomId, 
        duration: 0, // Will be set when video loads
        videoUrl: url 
      });
    }
  };

  const handleVideoEvent = (event, type) => {
    if (!isHost) return;

    const currentTime = videoRef.current?.currentTime || 0;
    
    switch (type) {
      case 'play':
        socket.emit('videoPlay', { roomId, currentTime });
        break;
      case 'pause':
        socket.emit('videoPause', { roomId, currentTime });
        break;
      case 'seeked':
        socket.emit('videoSeek', { roomId, currentTime });
        break;
      case 'loadedmetadata':
        const duration = videoRef.current?.duration || 0;
        socket.emit('videoLoaded', { roomId, duration, videoUrl: videoState.videoUrl });
        break;
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-effect p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={leaveRoom}
              className="control-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Room: {roomId}</h1>
              <p className="text-gray-300 text-sm">Connected as: {nickname}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="control-button"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="control-button"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="video-container"
            >
              {isHost && !videoFile && (
                <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Upload a video file to start streaming</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="campfire-gradient px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Choose Video File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
              
              {videoState.videoUrl && (
                <VideoPlayer
                  ref={videoRef}
                  src={videoState.videoUrl}
                  onPlay={() => handleVideoEvent(null, 'play')}
                  onPause={() => handleVideoEvent(null, 'pause')}
                  onSeeked={() => handleVideoEvent(null, 'seeked')}
                  onLoadedMetadata={() => handleVideoEvent(null, 'loadedmetadata')}
                  isHost={isHost}
                />
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Participants */}
            {showParticipants && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="glass-effect rounded-lg p-4"
              >
                <ParticipantsList participants={participants} />
              </motion.div>
            )}

            {/* Chat */}
            {showChat && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="glass-effect rounded-lg p-4"
              >
                <Chat roomId={roomId} nickname={nickname} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRoom; 