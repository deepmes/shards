let jwt = require('jsonwebtoken');
let config = require('./config');

function verifyToken(req, res, next){
    let token = req.headers.authentication;
    if(!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded){
        if(err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.'});

        req.userID = decoded.id;
        next();
    });
}

module.exports = verifyToken;