// Server-side code
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

let currentVideoTime = [];
let isVideoPlaying = false;

io.on('connection', (socket) => {
  console.log('A user connected');

  if (isVideoPlaying){
    socket.broadcast.emit('videoPause');
    socket.broadcast.emit("getTime")
    socket.broadcast.emit("sync", Math.max(...currentVideoTime))
  }

  // When a user plays the video, update isVideoPlaying and broadcast 'play' event
  socket.on('videoPlay', () => {
    isVideoPlaying = true;
    socket.broadcast.emit('play');
  });

  socket.on('videoPause', () => {
    isVideoPlaying = false;
    socket.broadcast.emit('pause');
  });

  socket.on("storeTime", (data) => {
    currentVideoTime.push(data)
    console.log(currentVideoTime)
  });

  socket.on("cleanUp", () => {
    currentVideoTime = [];
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
