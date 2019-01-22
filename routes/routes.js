const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", { title: "Mongo Scraper" });
  });
  app.get("/api/all", function(req, res) {
    db.Article.find({})
      .populate("notes")
      .then(function(articles) {
        res.render("saved", { title: "Saved Articles", articles: articles });
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  app.get("/api/scrape", function(req, res) {
    const articles = [];
    axios
      .get("https://medium.com/topic/technology")
      .then(function(response) {
        var $ = cheerio.load(response.data);

        $(".article-deck a:first-child").each(function(i, element) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this).text();
          result.link = $(this).attr("href");
          articles.push(result);
        });
      })
      .then(_ => {
        res.render("index", { title: "Mongo Scraper", articles: articles });
      });
  });
  app.post("/api/post", function(req, res) {
    db.Article.create({ title: req.body.title, link: req.body.link })
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  });
  app.post("/api/note/:id", function(req, res) {
    const id = req.params.id;
    db.Note.create({ text: req.body.text })
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: id },
          { $push: { notes: dbNote._id } },
          { new: true }
        );
      })
      .then(function(note) {
        res.json(note);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
  app.delete("/api/article/:id", function(req, res) {
    const id = req.params.id;
    db.Article.findByIdAndDelete({ _id: id })
      .then(function(dbArticle) {
        console.log(dbArticle);
        console.log(dbArticle.notes);
        db.Note.deleteMany({ _id: { $in: dbArticle.notes } }).then(function(
          response
        ) {
          res.json(response);
        });
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  });
  app.delete("/api/note/:id", function(req, res) {
    const id = req.params.id;
    db.Note.findByIdAndDelete(id)
      .then(function(dbNote) {
        // View the added result in the console
        console.log(dbNote);
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  });
  app.delete("/api/clearall", function(req, res) {
    db.Article.deleteMany()
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  });
};
