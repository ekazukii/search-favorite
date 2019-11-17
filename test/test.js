var chai = require('chai');
var assert = chai.assert;
var ItemFile = require("../models/item.js");
//var server = require('../index.js');

/*mongoose.connect('mongodb://localhost/shearch-engine', { useNewUrlParser: true,  useUnifiedTopology: true  }, function(err) {
  if (err) { throw err; }
  console.log("db launched");
  describe("Mocha + Chai Test assert", function() {
    describe("Database Unit Test", function() {
      describe("Item DB Test", function() {
        var ItemFile = require("../models/item.js");
        var ItemManager = new ItemFile(mongoose);
        it("should create new item named MochaUnitTest77", (done) => {
          console.log('it passed')
          var genre = "MochaUnitTest77";
          var site = "MochaUnitTest77";
          var tags = [ "MochaUnitTest77" ];
          ItemManager.addItem(genre, site, tags, function(id) {
            console.log(id);
            ItemManager.find({genre: genre, site: site, tags:tags}, function(result) {
              console.log(result)
              done();
            })
          });
        })
      })
    })
  })
});*/
describe("Mocha + Chai Test assert", function() {
  describe("Database Unit Test", function() {
    this.timeout(5000); // Edit the timeout for db connection
    describe("Item DB Test", function() {
      var ItemManager = new ItemFile();
      var genre = "MochaUnitTest77";
      var site = "MochaUnitTest77";
      var tags = [ "MochaUnitTest77" ];
      var itemId;

      it("Should not find item(s)", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags}, function(result) {
          assert.lengthOf(result, 0);
          done();
        })
      })

      it("Should add an item", function(done) {
        ItemManager.addItem(genre, site, tags, function(id) {
          itemId = id
          done()
        });
      })

      it("Should find the item added", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags}, function(result) {
          assert.lengthOf(result, 1);
          done();
        })
      })

      it("Should remove the item added", function(done) {
        ItemManager.removeItem(itemId, function(room) {
          done();
        })
      })

      it("Should not find item", function(done) {
        ItemManager.find({genre: genre, site: site, tags: tags}, function(result) {
          assert.lengthOf(result, 0);
          done();
        })
      })
      
    });
  });
});
