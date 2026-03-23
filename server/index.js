const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active rooms and their data
const rooms = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('joinRoom', ({ roomId, nickname }) => {
    console.log(`User ${nickname} (${socket.id}) attempting to join room ${roomId}`);
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      console.log(`Creating new room: ${roomId}`);
      rooms.set(roomId, {
        id: roomId,
        host: socket.id,
        participants: new Map(),
        videoState: {
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          videoUrl: null
        }
      });
    }

    const room = rooms.get(roomId);
    room.participants.set(socket.id, {
      id: socket.id,
      nickname: nickname || `Guest-${socket.id.slice(0, 6)}`,
      isHost: room.host === socket.id
    });

    // Send current room state to new participant
    socket.emit('roomJoined', {
      roomId,
      participants: Array.from(room.participants.values()),
      videoState: room.videoState,
      isHost: room.host === socket.id
    });

    // Notify others in room
    socket.to(roomId).emit('participantJoined', {
      participant: room.participants.get(socket.id)
    });

    console.log(`User ${nickname} successfully joined room ${roomId}`);
    console.log(`Room ${roomId} now has ${room.participants.size} participants`);
  });

  // Video control events
  socket.on('videoPlay', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.videoState.isPlaying = true;
      room.videoState.currentTime = currentTime;
      socket.to(roomId).emit('videoPlay', { currentTime });
    }
  });

  socket.on('videoPause', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.videoState.isPlaying = false;
      room.videoState.currentTime = currentTime;
      socket.to(roomId).emit('videoPause', { currentTime });
    }
  });

  socket.on('videoSeek', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.videoState.currentTime = currentTime;
      socket.to(roomId).emit('videoSeek', { currentTime });
    }
  });

  socket.on('videoLoaded', ({ roomId, duration, videoUrl }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.videoState.duration = duration;
      room.videoState.videoUrl = videoUrl;
      socket.to(roomId).emit('videoLoaded', { duration, videoUrl });
    }
  });

  // WebRTC signaling
  socket.on('offer', ({ roomId, offer, targetId }) => {
    socket.to(targetId).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ roomId, answer, targetId }) => {
    socket.to(targetId).emit('answer', { answer, from: socket.id });
  });

  socket.on('iceCandidate', ({ roomId, candidate, targetId }) => {
    socket.to(targetId).emit('iceCandidate', { candidate, from: socket.id });
  });

  // Chat messages
  socket.on('chatMessage', ({ roomId, message, nickname }) => {
    socket.to(roomId).emit('chatMessage', { message, nickname, timestamp: Date.now() });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.participants.has(socket.id)) {
        const participant = room.participants.get(socket.id);
        room.participants.delete(socket.id);
        
        // If host disconnects, end the session
        if (room.host === socket.id) {
          socket.to(roomId).emit('hostDisconnected');
          rooms.delete(roomId);
          console.log(`Room ${roomId} ended - host disconnected`);
        } else {
          // Notify others about participant leaving
          socket.to(roomId).emit('participantLeft', { participantId: socket.id });
        }
        
        break;
      }
    }
  });
});

// API routes
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (room) {
    res.json({
      roomId,
      participants: Array.from(room.participants.values()),
      videoState: room.videoState
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4();
  res.json({ roomId });
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the app`);
}); 