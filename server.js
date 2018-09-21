// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var moment = require("moment");

var cheerio = require("cheerio");
var request = require("request");
var db = require("./models");

// Initialize Express
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
// Use body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
// Use express
app.use(express.static("public"));
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
  useMongoClient: true
});

// catchall route
app.get("/", function (req, res) {
  res.send(index.html);
});

app.get("/scrape", function (req, res) {
//sends a request to the blog
  request("https://www.invisionapp.com/blog", function (error, response, html) {

  //sets $ to cheerio
    var $ = cheerio.load(html);

    //looks for title link
    $(".title-link").each(function (i, element) {

      //setting some variables for scraping
      var title = $(element).children().text();
      var link = $(element).attr("href");
      var snippet = $(element).siblings('p').text().trim();
      var articleCreated = moment().format("YYYY MM DD hh:mm:ss");

      //object for mongo
      var result = {
        title: title,
        link: link,
        snippet: snippet,
        articleCreated: articleCreated,

      };

      console.log(result);
      db.Article.findOne({
        title: title
      }).then(function (data) {
        console.log(data);
        if (data === null) {
          db.Article.create(result).then(function (dbArticle) {
            res.json(dbArticle);
          });
        }
      }).catch(function (err) {
        res.json(err);
      });

    });

  });
});

//rendering the articles
app.get("/articles", function (req, res) {

  db.Article
    .find({})
    .sort({
      articleCreated: -1
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});