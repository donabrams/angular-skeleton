var express = require('express');
var port = 8080;

var app = express();
app.use('/dev/bower_components', express.static(__dirname + "/bower_components"));
app.use('/dev/images', express.static(__dirname + "/assets/images"));
app.use('/dev', express.static(__dirname + "/dev_target"));
app.use('/prod', express.static(__dirname + "/target"));
app.get('/', function(req, res) {
    res.send('<a href="/dev">dev</a> | <a href="/prod">prod</a>');
});
app.listen(port);
console.log('TODO listening on port ' + 8080);