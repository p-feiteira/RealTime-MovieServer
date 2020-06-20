var http = require('http');
var fs = require('fs');
const ReadableStreamClone = require("readable-stream-clone");
var readStream = fs.createReadStream('F:\\Users\\Pedro Feiteira\\Documents\\GitHub\\RealTime-MovieServer\\test\\test.mkv');


http.createServer(function(req, res) {
  // The filename is simple the local directory and tacks on the requested url
  var filename = __dirname+req.url;
  var readStream1 = new ReadableStreamClone(readStream);
  // This line opens the file as a readable stream
  // This will wait until we know the readable stream is actually valid before piping
  //readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
      readStream1.pipe(res);
  //});

  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream1.on('error', function(err) {
    res.end(err);
  });
}).listen(8080);
console.log("Server Up!");