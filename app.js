var express = require('express')
var path = require('path');
var request = require('request');
var mongoose = require('mongoose');
var app = express();
app.use(express.static(path.join(__dirname,'/')));
app.engine('.html', require('ejs').renderFile);

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('App listening at http://%s%s', host, port)
})
console.log("Connecting to MongoDB...");
var db = mongoose.connect('mongodb://localhost:27017/Stocks').connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function (cb) { console.log('Connected to MongoDB: Stocks')});

/*var stockSchema = mongoose.Schema(
    { ticker: String,
        Articles: [{ url: String, title: String, date: String, weight: Number}],
        last_updated: ""
    });
var stockModel = mongoose.model('Articles', stockSchema);*/
var collection = db.collection('Articles');
app.get('/', function (req, res) {
  res.render('index.html', {
      title: 'Stock Project'
  });
});

app.get('/simpleGet', function (req, res) {
    console.log('Server - Simple Get Triggered');

    // input value from search
    var val = req.query.ticker.trim();

    // url used to search yql
    //var url = "http://finance.yahoo.com/q/h?s=" + val;
    collection.find( {'ticker': val}).each(function(err, docs) {
        //{ 'ticker' : val}
        if(err != null)
            console.log("ERROR:" + err);
        console.log("DOCS:" + docs);
        if(docs != null)
            res.send(docs)
    });
    //console.log(resultFromMongo);
// request module is used to process the yql url and return the results in JSON format
    //request(url, function(err, resp, body) {
//        res.send(body);
//    });
});
