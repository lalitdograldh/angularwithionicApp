var express = require('express');
var router = express.Router();
var _twit = require('twit');

var configTwit = require('../configTwit');

var twitter = new _twit(configTwit);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var query = req.query.twitquery;
  var searchContent = {
      q: query,
      count: 100
  };
  twitter.get('search/tweets', searchContent, getData);
  function getData(err, data, response) {
      //var fs = require('fs');
      //fs.writeFile("results.json",json);
      res.render('results', {data: data, query: query});
  };
});

module.exports = router;
