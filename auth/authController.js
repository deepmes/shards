let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('./config');
let moment = require('moment');
let bodyParser = require('body-parser');
let mysqlCloud = require('../dbConfig/dbCloud');

let verifyToken = require('./verifyToken');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.post('/register', function(req, res){
        
        if(req.body){

            let hashedBrown = bcrypt.hashSync(req.body.password);

            function registerMe(){
                return new Promise(function(resolve, reject){
                    mysqlCloud.poolCloud.getConnection(function(err, connection){
                        if(err) return res.send({ error: 'registration database connection error'});
                        connection.query({
                            sql: 'INSERT INTO deepmes_auth_login SET registration_date=? , name=?,  email=?, department=?, password=?',
                            values: [moment(new Date()).format(), req.body.name, req.body.email, req.body.department, hashedBrown]
                        }, function(err, results, fields){
                            if(err) return res.send({ error: err});
                            
                            let token = jwt.sign({ id: results.insertId }, config.secret);

                            res.status(200).send({auth: true, token: token});

                        });
                        connection.release();
                    });
                });
            }

            registerMe();

        }
        
    });

    app.get('/me', verifyToken, function(req, res, next){
        function checkUserID(){
            return new Promise(function(resolve, reject){
                mysqlCloud.poolCloud.getConnection(function(err, connection){
                    if(err) return res.send({ error: 'checking user id connection error'});
                    connection.query({
                        sql: 'SELECT * FROM deepmes_auth_login WHERE id =?',
                        values: [req.userID]
                    }, function(err, results, fields){
                        console.log(results);
                        res.status(200).send(results);
                    });
                    connection.release();
                });
            });
        }
       
        checkUserID();

    });
}