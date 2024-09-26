// Server-side code
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const room = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
  length: 2
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

let currentVideoTime = 0;
let isVideoPlaying = false;

io.on('connection', (socket) => {
  socket.join(room);
  console.log('User ' + socket.id + " added to " + room);
  syncFunc()
  if (socket.rooms.size > 1) {
    io.to(room).emit("setup");
    io.to(room).emit("sync");
    if (isVideoPlaying) {
      io.to(room).emit('play');
    }
  }

  // When a user plays the video, update isVideoPlaying and to(room) 'play' event
  socket.on('videoPlay', () => {
    isVideoPlaying = true;
    io.to(room).emit('play');
  });

  socket.on('videoPause', () => {
    isVideoPlaying = false;
    io.to(room).emit('pause');
  });

  socket.on("storeTime", (data) => {
    currentVideoTime = Math.max(currentVideoTime, data ? data : 0)
  });

  socket.on("cleanUp", () => {
    currentVideoTime = 0;
  });

  socket.on('disconnect', () => {
    socket.leave(room)
    syncFunc()
    console.log('A user disconnected from ' + room);
  });

});

function syncFunc() {
  io.to(room).emit("getTime");
}

// Set interval to execute doSomething every 5 seconds (5000 milliseconds)
const timer = setInterval(syncFunc, 5000);

const stopTimer = setInterval(() => {
  if (isVideoPlaying) {
    clearInterval(timer); // Stop the timer after 10 repetitions
    clearInterval(stopTimer); // Stop the repetition count checker
  }
}, 5000); // Check every 5 seconds

server.listen(3000, () => {
  console.log('Server running on port 3000');
});