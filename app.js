var express = require('express')
var path = require('path');
var app = express();
var request = require('request');

app.use(express.static(path.join(__dirname,'/')));
app.engine('.html', require('ejs').renderFile);
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('App listening at http://%s%s', host, port)
})

app.get('/', function (req, res) {
  res.render('index.html', {
      title: 'Stock Project'
  });
});

app.get('/simpleGet', function (req, res) {
    console.log('Server - Simple Get Triggered');
    //var json = JSON.parse(req.query);
    console.log(req.query);
    //console.log(json.ticker);
    // input value from search
    var val = req.query.ticker.trim();//console.log(val);
    console.log(val);
// url used to search yql

    var url = "http://finance.yahoo.com/q/h?s=" + val;
    console.log(url);

// request module is used to process the yql url and return the results in JSON format
    request(url, function(err, resp, body) {
        console.log(body);

        /*// logic used to compare search results with the input from user
        // console.log(!body.query.results.RDF.item['about'])
        if (!body.query.results.RDF.item['about'] === false) {
            craig = "No results found. Try again.";
        } else {
            results = body.query.results.RDF.item[0]['about']
            craig = '<a href ="'+results+'">'+results+'</a>'
        }
        // pass back the results to client side*/
        res.send(body);
    });

});


