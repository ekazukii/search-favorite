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
    if(genre) {
      query.genre = genre;
    }

    var site = req.query["site"];
    if(site) {
      query.site = site;
    }

    var tags = req.query["tags"];
    if(tags) {
      query.tags = [tags];
    }

    ItemManager.find(query, function(result) {
      res.render("search.ejs", {results: result, querys: query});
    })
  })

  app.get("/addFav", function(req, res) {
    res.render('addFav.ejs', {success: false});
  });

  app.post('/addFav', function(req, res) {
    var url = req.body.url;
    var genre = req.body.genre;
    var site = req.body.site;
    var tags = req.body.tags;

    if (url && genre && site && tags)
    {
      var tagsArray = tags.split(' ');
      var values = {url: url, genre: genre, site: site, tags: tagsArray}
      ItemManager.addItem(values, function(id) {
        console.log('Un site a été ajouté id: '+id);
        res.render('addFav.ejs', {success: true})
      })
    }
  });
}
