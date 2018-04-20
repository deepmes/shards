let express = require('express');
let app = express();
let authController = require('./auth/authController');
let apiController = require('./controllers/apiController');

let RateLimit = require('express-rate-limit');
let port = process.env.PORT || 3030;

let apilimiter = new RateLimit({
    windowMs: 60*1000,
    max: 10,
    delayMs: 0
});

app.use('/', express.static(__dirname + '/public'));
app.use('/shards/', apilimiter);

authController(app);
apiController(app);

app.listen(port);