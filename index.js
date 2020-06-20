/*const express = require('express')
const app = express()
const path = require('path');
const PORT = 8080
const IP = '192.168.1.7'

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  
app.use(express.static('public', options))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  })
  
app.listen(PORT, IP, ()=>{
    console.log('Server started on port: ' + PORT)
})*/

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('stream', (data) => {
    socket.emit('stream', );
  });
});
