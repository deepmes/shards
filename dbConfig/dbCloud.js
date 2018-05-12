let mysql = require('mysql');
let config = require('./config');

let connectAuth = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 1000,
    host: config.config.host,
    user: config.config.user,
    password: config.config.password,
    database: config.config.database
});

exports.connectAuth = connectAuth;