var express = require('express');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var favicon = require('serve-favicon');
var path = require('path');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname + '/public'));

var port = 8543;
const MongoClient = require("mongodb").MongoClient;
var db;


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function(socket) {
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  MongoClient.connect(
    "mongodb+srv://cronoses:nuggets@cluster0-lrtb2.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true },
    (err, client) => {
      if (err) return console.log(err);
      db = client.db("IOT");
      db.collection("data")
        .find()
        .sort({ _id: -1 })
        .limit(20)
        .toArray((err, result) => {
          if (err) return console.log(err);
          console.log(result);
          io.emit("data", result);
        });

      const stream = db.collection("data").watch();
      stream.on("change", change => {
        if (change.operationType === "insert") {
          db.collection("data")
          .find()
          .sort({ _id: -1 })
          .limit(20)
          .toArray((err, result) => {
            if (err) return console.log(err);
            console.log(result);
            io.emit("data", result);
          });
        }
      });
    }
  );
});

http.listen(port, function() {
  console.log("listening on http://localhost:" + port + "/");
});
