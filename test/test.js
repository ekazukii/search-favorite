"use strict";
var chai = require('chai');
var assert = chai.assert;
var ItemFile = require("../models/item.js");

describe("Mocha + Chai Test assert", function() {
  describe("Database Unit Test", function() {
    this.timeout(5000); // Edit the timeout for db connection
    describe("Item DB Test", function() {
      var ItemManager = new ItemFile();
      var genre = "MochaUnitTest77";
      var site = "MochaUnitTest77";
      var tags = [ "MochaUnitTest77" ];
      var url = "MochaUnitTest77";
      var itemId;

      it("Should not find item(s)", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags}, function(result) {
          assert.lengthOf(result, 0);
          done();
        });
      });

      it("Should add an item", function(done) {
        ItemManager.addItem({genre: genre, site: site, tags: tags, url: url}, function(id) {
          itemId = id;
          done();
        });
      });

      it("Should find the item added", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags, url: url}, function(result) {
          assert.lengthOf(result, 1);
          done();
        });
      });

      it("Should remove the item added", function(done) {
        ItemManager.removeItem(itemId, function(room) {
          done();
        });
      });

      it("Should not find item", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags, url: url}, function(result) {
          assert.lengthOf(result, 0);
          done();
        });
      });
    });
  });
});
