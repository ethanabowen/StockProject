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

    var val = req.query.ticker.trim(); // input value from search
    collection.find({ 'ticker' : val },{limit:5, sort: [['_id',-1]]}).toArray(function(e, results){
        //if (e) return next(e)
        ///console.dir(e, results)
        res.send(results)
    })
});
