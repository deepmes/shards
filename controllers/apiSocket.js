let mysqlCloud = require('../dbConfig/dbCloud');
let moment = require('moment');

module.exports = function(io){
    let toolConnectedSequence = new Map();

        io.on('connection', function(socket){
            /*
            console.info(`Client connected [id=${socket.id}]`);
            toolConnectedSequence.set(socket, 1);

            socket.on('disconnect', function(){
                toolConnectedSequence.delete(socket);
                console.info(`Client gone [id=${socket.id}]`);
            });
            */ 
           
            let tool_list = [
                'NTM17',
                'NTM1718',
                'NTM18',
                'NTM19',
                'NTM1920',
                'NTM20',
                'NTM21',
                'NTM2122',
                'NTM22',
                'NTM22-2'
            ];

            mysqlCloud.connectAuth.getConnection(function(err, connection){
                if(err){throw err};


                socket.on('device_data', function(data){ // Common data listener.

                    for(let i=0; i<tool_list.length; i++){
                        //console.log(tool_list[i]);
                        if(data.position == 'LOADER'){

                            if(data.tool_id == tool_list[i]){
                                
                                connection.query({
                                    sql: 'INSERT INTO deepmes_arduino_count SET data_uuid=?, date_time=?, tool_id=?, param=?, position=?, wafer_count=?',
                                    values: [data.data_uuid, data.date_time, data.tool_id, data.param, data.position, data.value]
                                }, function(err, results, fields){

                                });

                            }

                        } else if(data.position == 'UNLOADER'){
                            
                            if(data.tool_id == tool_list[i]){

                                connection.query({
                                    sql: 'INSERT INTO deepmes_arduino_count SET data_uuid=?, date_time=?, tool_id=?, param=?, position=?, wafer_count=?',
                                    values: [data.data_uuid, data.date_time, data.tool_id, data.param, data.position, data.value]
                                }, function(err, results, fields){
                            
                                }); 

                            }
                        }

                    }

                    console.log(data);
                });

                socket.on('device_connected', function(data){ //
                    console.log(data);
                });

                socket.on('device_disconnected', function(data){
                    console.log(data);
                });
                
                
                connection.release();
                
            });

        });

}