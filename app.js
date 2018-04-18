let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 7070;

app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

server.listen(port);