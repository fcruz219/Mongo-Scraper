var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/OnionHeadlines", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/OnionHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {
  console.log("Scraped")

  axios.get("https://www.theonion.com/").then(function (response) {

    var $ = cheerio.load(response.data);


    $("article").each(function (i, element) {

      var result = {};

      result.title = $(this)
        .children('header')
        .find('h1')
        .text();
      result.link = $(this)
        .children("header")
        .find("a")
        .attr("href");
      result.summary = $(this)
        .children("div")
        .find("p")
        .text();

      // Save these result in an object that we'll push into the result array we defined earlier
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });

    });

    res.redirect("/");
  });
});

app.get("/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.body(dbArticle)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
