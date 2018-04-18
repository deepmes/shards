let express = require('express');
let apip = express();
let apiControllers = require('controllers/apiControllers');
let port = process.env.PORT || 3030;

apiControllers(app);

api.listen(port);