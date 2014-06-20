var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req,res) {
  res.sendfile('index.html');
});

var server = app.listen('3000',function(){
  console.log('listening on port %s', server.address().port);
});