# 🔥 Campfire Movie Server

A real-time movie streaming application with peer-to-peer video sharing and synchronized playback. Built with React, Node.js, Socket.io, and WebRTC.

## ✨ Features

- **Local Video Hosting**: Upload and stream videos directly from your browser
- **Peer-to-Peer Streaming**: WebRTC-based video sharing between participants
- **Real-time Sync**: Synchronized play, pause, and seek across all participants
- **Room-based Sessions**: Create or join rooms with unique IDs
- **Live Chat**: Real-time messaging between participants
- **Beautiful UI**: Campfire-themed design with smooth animations
- **No Cloud Storage**: Videos stay local, never uploaded to servers

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RealTime-MovieServer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Simple Peer** - WebRTC peer connections
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **UUID** - Room ID generation

## 🎯 How It Works

### Video Streaming Flow
1. **Host uploads video**: Host selects a local video file
2. **WebRTC connection**: Host establishes peer connections with viewers
3. **P2P streaming**: Video streams directly from host to viewers
4. **Real-time sync**: Socket.io coordinates playback state

### Session Management
- **Room Creation**: Host creates a room and gets a unique room ID
- **Room Joining**: Participants join using the room ID
- **Host Control**: Only the host can control video playback
- **Session End**: Session ends when host disconnects

## 📁 Project Structure

```
RealTime-MovieServer/
├── server/
│   └── index.js          # Express server with Socket.io
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MovieRoom.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ParticipantsList.jsx
│   │   │   └── Chat.jsx
│   │   ├── contexts/
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🎮 Usage

### Creating a Room
1. Enter your nickname
2. Click "Create New Room"
3. Share the room ID with friends

### Joining a Room
1. Enter your nickname
2. Enter the room ID
3. Click "Join Room"

### Hosting a Video
1. As the host, click "Choose Video File"
2. Select a video file (MP4 recommended)
3. The video will stream to all participants

### Controls
- **Play/Pause**: Host controls playback for everyone
- **Seek**: Click on the progress bar to jump to a specific time
- **Volume**: Individual volume control for each participant
- **Fullscreen**: Click the fullscreen button

## 🔧 Development

### Available Scripts

```bash
# Start both server and client in development mode
npm run dev

# Start only the server
npm run server

# Start only the client
npm run client

# Build the client for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## 🌟 Key Features Explained

### Local Video Hosting
- Videos are never uploaded to the server
- Host's browser serves video directly to participants
- Uses WebRTC for efficient peer-to-peer streaming

### Real-time Synchronization
- Socket.io broadcasts video state changes
- All participants stay in sync automatically
- Late joiners receive current playback state

### Session Management
- Sessions end when host disconnects
- No persistent storage - everything is in-memory
- Simple room-based access control

## 🚨 Limitations (MVP)

- Host must stay connected for session to continue
- No video file persistence between sessions
- Limited to browser-compatible video formats
- WebRTC requires HTTPS in production

## 🔮 Future Enhancements

- [ ] Video file persistence
- [ ] Multiple host support
- [ ] Screen sharing capability
- [ ] Mobile app support
- [ ] End-to-end encryption
- [ ] Video quality controls
- [ ] Recording functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**WebRTC not working**
- Ensure you're using HTTPS in production
- Check browser permissions for camera/microphone
- Try refreshing the page

**Video not playing**
- Check if the video format is supported by the browser
- Ensure the video file is not corrupted
- Try a different video file

**Connection issues**
- Check if the server is running on the correct port
- Ensure firewall allows connections
- Try restarting the development server

---

Built with ❤️ for real-time movie watching experiences 