var app = require("express")();

var server = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
}).get('/:file', function(req, res) {
	res.sendFile(__dirname + '/views/' + req.params.file);
});

server.listen(8080 || process.env.PORT);
console.log("Server on!");