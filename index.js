"use strict";

const express = require('express');
const app = express();
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + "/public"));

const appRoutes = require('./routes/routes.js')(app);
var mongoose = require('mongoose');
var options = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect('mongodb://localhost/search-engine', options, function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'search-engine'");

  app.listen(3000, function() {
    console.log('serveur lancé sur le port 3000');

    startServeur()

  })
});

function startServeur() {
  console.log("serveur opérationnel");
}
