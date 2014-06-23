var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req,res) {
  res.sendfile('index.html');
});

var port = process.env.PORT || 3000;

var server = app.listen(port,function(){
  console.log('listening on port %s', server.address().port);
});