let express = require('express');
let app = express();
let authController = require('./controllers/authController');
let apiController = require('./controllers/apiController');
let port = process.env.PORT || 3030;

app.use('/', express.static(__dirname + '/public'));

authController(app);
apiController(app);

app.listen(port);