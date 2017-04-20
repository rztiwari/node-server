var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.send('<html><head></head><body><h1>Hello World!</h1></body></html>')
});

app.listen(port);
