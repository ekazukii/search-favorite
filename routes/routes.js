"use strict";
var ItemFile = require("../models/item.js");
var ItemManager = new ItemFile();

module.exports = function (app) {
  app.get("/", function(req, res) {
    res.render('index.ejs')
  })

  app.get("/search", function(req, res) {
    var query = {};
    var genre = req.query["genre"];
    if(typeof genre !== "undefined") {
      query.genre = genre;
    }

    var site = req.query["site"];
    if(typeof site !== "undefined") {
      query.site = site;
    }

    var tags = req.query["tags"];
    if(typeof tags !== "undefined") {
      query.tags = [tags];
    }

    console.log(query);

    ItemManager.find(query, function(result) {
      console.log(result)
      res.render("search", {results: result, querys: query});
    })
  })
}
