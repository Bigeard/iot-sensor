const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;
var db;

MongoClient.connect(
  "mongodb+srv://cronoses:nuggets@cluster0-lrtb2.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("IOT"); // whatever your database name is

    app.get("/", (req, res) => {
      db.collection("data")
        .find()
        .toArray((err, result) => {
          if (err) return console.log(err);
          console.log(result);
          console.log(result.sort({x:1}));
          
          // renders index.ejs
          res.render("index.ejs", { data: result });
        });
    });

    app.listen(3000, () => {
      console.log("listening on localhost:3000");
    });
  }
);
