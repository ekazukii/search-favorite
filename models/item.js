"use strict";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/search-engine?authSource=admin', { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false, user: process.env.DB_USER, password: process.env.DB_PASS  }, function(err) {
  if (err) { throw err; }
  //console.log("Connecté à la base de données 'search-engine'");
});

module.exports = class Item {
  constructor() {
    this.itemSchema = new mongoose.Schema({
      genre : String,
      site : String,
      date : { type : Date, default : Date.now },
      tags : [ String ],
      url : String,
    });

    this.ItemModel = mongoose.model('item', this.itemSchema);
  }

  addItem(value, callback) {
    var newItem = new this.ItemModel({ genre : value.genre, site: value.site, tags: value.tags, url: value.url });
    newItem.save(function(err, room) {
      if (err) throw err;
      callback(room.id)
    })
  }

  removeItem(id, callback) {
    this.ItemModel.findByIdAndRemove(id, function(err,room) {
      if (err) throw err;
      callback(room)
    });
  }

  find(info, callback) {
    var self = this;
    if(typeof info.tags !== "undefined") { // Search with tags
      var match = {$match: { "$and": [ { "tags" :  { "$in": info.tags} } ] } };
      if (typeof info.genre !== "undefined") {
        match["$match"]["$and"].push({"genre": info.genre});
      }
      if (typeof info.site !== "undefined") {
        match["$match"]["$and"].push({"site": info.site});
      }
      var aggregate = [
        match,
        {$unwind: "$tags"},
        {$group: { "_id": {"_id": "$_id", "genre": "$genre", "site": "$site", "url": "$url"},  "matches":{$sum:1}, "listOfTags": {$push: "$tags"}}},
        {$sort: {"matches":-1}},
      ]
      this.ItemModel.aggregate((aggregate), function(err, result) {
        if (err) throw err;
        console.log("recherche avec tags effecuté");
        callback(result);
      });
    } else { // Search without tags
      var match = {$match: {$and: []}};
      if (typeof info.genre !== "undefined") {
        match["$match"]["$and"].push({"genre": info.genre});
      }
      if (typeof info.site !== "undefined") {
        match["$match"]["$and"].push({"site": info.site});
      }
      var group = {$group: {"_id": {'_id': "$_id", "genre": "$genre", "site": "$site", "url": "$url"}}}
      this.ItemModel.aggregate(([match, group]), function(err, result) {
        if (err) throw err;
        console.log("recherche sans tags effecuté");
        callback(result);
      });
    }
  }
}
