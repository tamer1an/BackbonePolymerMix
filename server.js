const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const args = require('minimist')(process.argv.slice(2));

const port = args.p || 3000;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/help', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/documentation.html'));
});

http.createServer(app).listen(port, () => {
    console.log('Express server listening on port: ' + port);
});
