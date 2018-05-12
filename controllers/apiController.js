let mysqlCloud = require('../dbConfig/dbCloud');
let verifyToken = require('../auth/verifyToken');
let moment = require('moment');

module.exports = function(app){
    
    app.get('/shards/statout/:process', verifyToken, function(req, res){

        if(req.query.processName == 'damage' || req.query.processName == 'bsgdep' || req.query.processName == 'ntm' || req.query.processName == 'noxe' || req.query.processName == 'ptm' || req.query.processName == 'toxe' || req.query.processName == 'cleantex' || req.query.processName == 'arc_barc' || req.query.processName == 'lcm' || req.query.processName == 'seed' || req.query.processName == 'plm' || req.query.processName == 'edg_ctr' || req.query.processName == 'plating' || req.query.processName == 'etchbk' || req.query.processName == 'test'){
            mysqlCloud.poolCloud.getConnection(function(err, connection){
                if(!err){

                    function params(){
                        return new Promise(function(resolve, reject){
                            try {
                                let processName = req.query.processName;
                                if(processName){
                                    resolve(processName);
                                } else {
                                    reject('processName missing');
                                }
                            } catch(err) {
                                reject(err);
                            }
                        });
                    }

                    params().then(function(processName){
                        function queryProcessName(){
                            return new Promise(function(resolve, reject){
                                
                                connection.query({
                                    sql: 'SELECT * FROM deepmes_status_and_outs WHERE process_name = ?',
                                    values: [processName]
                                },  function(err, results, fields){
                                    let db_response = [];
                                    for(let i=0;i<results.length;i++){
                                        db_response.push({
                                                extracted_date: moment(results[i].extracted_date).format(),
                                                process_name: results[i].process_name,
                                                tool_name: results[i].tool_name,
                                                P: results[i].P,
                                                SU: results[i].SU,
                                                SD: results[i].SD,
                                                D: results[i].D,
                                                E: results[i].E,
                                                SB: results[i].SB,
                                                OUTS: results[i].OUTS
                                        });
                                    }

                                    if(db_response.length == results.length){
                                        let response = JSON.stringify({
                                            statusOuts:{
                                                data: db_response
                                            }
                                        });
                                        resolve(response);
                                    }
                                });
                                connection.release();     
                                    
                            });
                        }

                        queryProcessName().then(function(response){
                            try {
                                res.send(response);
                            } catch(err) {
                                res.send(err);
                            }
                        });

                    });

                }else{
                    res.send(JSON.stringify({shards : { code: '100', error: 'database connection error'}}));
                }
            });
        } else if(req.query.processName == 'poly' || req.query.processName == 'ndep' || req.query.processName == 'pdrive' || req.query.processName == 'pba' || req.query.processName == 'fga'){
            res.status(400).send({ error: 'MRL process not yet included.'});
        } else {
            res.status(400).send({ error: 'Invalid process name.'});
        }

    });
    
}
