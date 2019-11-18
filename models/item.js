"use strict";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/search-engine', { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false  }, function(err) {
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

  find(query, callback) {
    var aggregate = [
      {$match : { "tags" : { "$in": query.tags}}},
      {$unwind: "$tags"},
      {$group: { "_id": {"_id" : "$_id", "url" : "$url", "genre": query.genre, "site": query.site}, "matches":{$sum:1}}},
      {$sort: {"matches":-1}},
    ]
    this.ItemModel.aggregate((aggregate), function(err, result) {
      if (err) throw err;
      callback(result);
    })
  }
}
