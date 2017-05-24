var cors = require("cors");
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var slashes = require('slashes');

function addslashes(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}

/*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
if (error) throw error;
console.log('The solution is: ', results[0].solution);
});*/
var _twit = require('twit');
var configTwit = require('../configTwit');
var twitter = new _twit(configTwit);
router.use(bodyParser.json());

router.use(cors({ credentials: true, origin: 'http://localhost:8100' }));
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Twitter Search' });
});

router.post('/app',function(req, res) {
    var query = "";
    if(typeof req.body.name != "undefined" &&  req.body.name != ""){
        var names = req.body.name.split(",");
        for(var i = 0; i < names.length ; i++){
            query = query.concat(names[i]);
            if(i != names.length - 1){
                query = query.concat(" OR ");
            }
        }
    }

    if(typeof req.body.team != "undefined" && req.body.team != ""){
        if(req.body.first == 2){
            query = query.concat(" OR ");
        }else {
            query = query.concat(" ");
        }
        var teams = req.body.team.split(",");
        for(var i = 0; i < teams.length ; i++){
            query = query.concat(teams[i]);
            if(i != teams.length - 1){
                query = query.concat(" OR ");
            }
        }
    }
    if(typeof req.body.author != "undefined" && req.body.author != ""){
        if(req.body.second == 2){
            query = query.concat(" OR ");
        }else {
            query = query.concat(" ");
        }
        query = query.concat("from:"+req.body.author);
    }
    if(typeof req.body.keyword != "undefined" && req.body.keyword != ""){
        query = query.concat(" ");
        var keywords = req.body.keyword.split(",");
        for(var i = 0; i < keywords.length ; i++){
            query = query.concat(keywords[i]);
            if(i != keywords.length - 1){
                query = query.concat(" OR ");
            }else {
                query = query.concat(" ");
            }
        }
    }
    var searchContent = {
        q: query,
        count: 100
    };
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'uniqu2vo_twiiterapp'
    });
    connection.connect(function(err,callback){
//console.log(arguments,"dsfdsf");
var queryString = 'SELECT * FROM tweets WHERE tweetQuery = "'+query+'"';
connection.query(queryString, function(err,rows){
    var count;

    if(typeof rows == "undefined")
        count= 0;
    else
        count = rows.length;
    if (count >= 1) {
        var msg = 'name already exists.';
        var resp = new Array();
        resp.push(slashes.strip(rows[0].tweetResponseData));
        
        res.send(rows[0].tweetResponseData);
        
    } else { 
       // console.log('asdasdasdasd');
       twitter.get('search/tweets', searchContent, getData);
       function getData(err, data, response) {
           var queryInsert=  "INSERT INTO tweets (tweetQuery ,tweetResponseData, tweetAddDate) VALUES('"+query+"','"+slashes.add(JSON.stringify(data))+"','2017-05-1 12:00:00')";
//console.log(res.json(data));
connection.query(queryInsert, function(err,rows){
    console.log(err);
    res.send(data);
});
};
}
});
});  
});
router.post('/',function(req, res) {
    var query = "";
    if(typeof req.body.name != "undefined" &&  req.body.name != ""){
        var names = req.body.name.split(",");
        for(var i = 0; i < names.length ; i++){
            query = query.concat(names[i]);
            if(i != names.length - 1){
                query = query.concat(" OR ");
            }
        }
    }

    if(typeof req.body.team != "undefined" && req.body.team != ""){
        if(req.body.first == 2){
            query = query.concat(" OR ");
        }else {
            query = query.concat(" ");
        }
        var teams = req.body.team.split(",");
        for(var i = 0; i < teams.length ; i++){
            query = query.concat(teams[i]);
            if(i != teams.length - 1){
                query = query.concat(" OR ");
            }
        }
    }
    if(typeof req.body.author != "undefined" && req.body.author != ""){
        if(req.body.second == 2){
            query = query.concat(" OR ");
        }else {
            query = query.concat(" ");
        }
        query = query.concat("from:"+req.body.author);
    }
    if(typeof req.body.keyword != "undefined" && req.body.keyword != ""){
        query = query.concat(" ");
        var keywords = req.body.keyword.split(",");
        for(var i = 0; i < keywords.length ; i++){
            query = query.concat(keywords[i]);
            if(i != keywords.length - 1){
                query = query.concat(" OR ");
            }else {
                query = query.concat(" ");
            }
        }
    }

    console.log(query);


//res.redirect('/results/?twitquery=' + query);
});
module.exports = router;
