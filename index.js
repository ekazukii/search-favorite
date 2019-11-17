"use strict";

const express = require('express');
const app = express();
const appRoutes = require('./routes/routes.js')(app);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shearch-engine', { useNewUrlParser: true,  useUnifiedTopology: true  }, function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'shearch-engine'");

  app.listen(3000, function() {
    console.log('serveur lancé sur le port 3000');

    startServeur()

  })
});

function startServeur() {
  console.log("serveur opérationnel")
  //var ItemFile = require("./models/item.js");
  //var ItemManager = new ItemFile(mongoose);
  /*ItemManager.addItem("Test", "Test", ["test"], function(id) {
    console.log(id);
  });*/

}
