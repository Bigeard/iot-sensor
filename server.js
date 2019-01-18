// var app = require("express")();
// var http = require("http").Server(app);
// var io = require("socket.io")(http);
// var port = process.env.PORT || 3000;
// // const MongoClient = require("mongodb").MongoClient;
// // var db;

// // MongoClient.connect(
// //   "mongodb+srv://cronoses:nuggets@cluster0-lrtb2.mongodb.net/test?retryWrites=true",
// //   { useNewUrlParser: true },
// //   (err, client) => {
// //     if (err) return console.log(err);
// //     db = client.db("IOT"); // whatever your database name is

//     app.get("/", function(req, res) {
//       res.sendFile(__dirname + "/index.html");
//     });

//     io.on('connection', function(socket){
//       console.log('a user connected');
//       socket.on('disconnect', function(){
//         console.log('user disconnected');
//       });
//     });

//     // io.on("connection", function() {
//     //   console.log("data");

//     //   io.emit(
//     //     "data",
//     //     db
//     //       .collection("data")
//     //       .find()
//     //       .sort({ _id: -1 })
//     //       .limit(1)
//     //       .toArray((err, result) => {
//     //         if (err) return console.log(err);
//     //         console.log(result);
//     //       })
//     //   );
//     // });

//     app.listen(port, () => {
//       console.log("listening on http://localhost:" + port + "/");
//     });
// //   }
// // );

var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var data;
const MongoClient = require("mongodb").MongoClient;
var db;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
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
        .limit(1)
        .toArray((err, result) => {
          if (err) return console.log(err);
          console.log(result);
          io.emit("data", result[0]);
        });

      const stream = db.collection("data").watch();
      stream.on("change", change => {
        if (change.operationType === "insert") {
          let result = [];
          result.push(change.fullDocument);
          console.log(result);
          io.emit("data", result[0]);
        }
      });
    }
  );
});

http.listen(3000, function() {
  console.log("listening on http://localhost:" + port + "/");
});
