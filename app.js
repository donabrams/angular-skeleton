var express = require('express');
var port = 8080;

var app = express();
app.use(express.static(__dirname + "/static"));
app.listen(port);
console.log('simple-gannt listening on port ' + 8080);