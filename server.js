var app, express, http, path, server;

express = require('express');
http = require('http');
path = require('path');
app = express();
app.set('port', process.env.PORT || 3001);
app.use(express["static"](path.join(__dirname, 'build')));

server = http.createServer(app).listen(app.get('port'), function() {
    return console.log('Express server listening on port: ' + app.get('port'));
});