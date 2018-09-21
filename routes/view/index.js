var router = require("express").Router();
var db = require("../../models");

router.get("/", function(req, res) {
  db.Headline.find({ saved: false })
    .sort({ date: -1 })
    .then(function(dbArticles) {
      //renders the home page
      res.render("home", { articles: dbArticles });
    });
});


module.exports = router;
