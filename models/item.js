"use strict";
require("dotenv").config()
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/search-engine?authSource=admin', { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false, user: process.env.DB_USER, pass: process.env.DB_PASS  }, function(err) {
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
      nbrClick: { type : Number, default : 0 },
    });

    this.ItemModel = mongoose.model('item', this.itemSchema);
  }

  addClick(id, callback) {
    this.ItemModel.findOneAndUpdate({ _id: id}, { $inc: { nbrClick: 1} }, {new: true}, function(err, res) {
      if (err) {
        callback(err)
      } else {
        callback(res)
      }
    })
  }

  addItem(value, callback) {
    var url = encodeURI(value.url)
    var newItem = new this.ItemModel({ genre : value.genre, site: value.site, tags: value.tags, url: url });
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
    if(typeof info.tags !== "undefined") { // Search with tags
      var match = {$match: { "$and": [ { "tags" :  { "$in": info.tags} } ] } };
      if (typeof info.genre !== "undefined") {
        match["$match"]["$and"].push({"genre": info.genre});
      }
      if (typeof info.site !== "undefined") {
        match["$match"]["$and"].push({"site": info.site});
      }
      // TODO : SORT BY NUMBER OF CLICK AND MATCHES https://stackoverflow.com/questions/35027471/how-to-sort-two-fields-with-mongoose
      var aggregate = [
        match,
        {$addFields : { listOfTags: "$tags" }},
        {$unwind: "$tags"},
        match,
        {$group: { "_id": {"_id": "$_id", "genre": "$genre", "site": "$site", "url": "$url", "listOfTags": "$listOfTags"}, "nbrClick": {$max: "$nbrClick"}, "matches":{$sum:1}}},
        {$sort: {"matches":-1, "nbrClick":-1 }},
      ]
      this.ItemModel.aggregate((aggregate), function(err, result) {
        if (err) throw err;
        console.log("recherche avec tags effecuté");
        console.log(result)
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
      var group = {$group: {"_id": {'_id': "$_id", "genre": "$genre", "site": "$site", "url": "$url"}, "listOfTags": {$first: "$tags"}}}
      this.ItemModel.aggregate(([match, group]), function(err, result) {
        if (err) throw err;
        console.log("recherche sans tags effecuté");
        callback(result);
      });
    }
  }
}
