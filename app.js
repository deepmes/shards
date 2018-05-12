let express = require('express');
let app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server,{
    path: '/socketserver'
});

let authController = require('./auth/authController');
let apiController = require('./controllers/apiController');
let apiSocket = require('./controllers/apiSocket');

let RateLimit = require('express-rate-limit');
let port = process.env.PORT || 3030;

let apilimiter = new RateLimit({
    windowMs: 60*1000,
    max: 10,
    delayMs: 0,
    message: JSON.stringify({error: 'You are only allowed 10 requests per minute. Try again later.'})
});

app.use('/', express.static(__dirname + '/public'));
app.use('/shards/', apilimiter);

authController(app);
apiController(app);
apiSocket(io);

server.listen(port);