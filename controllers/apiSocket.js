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
            
            mysqlCloud.connectAuth.getConnection(function(err, connection){

                socket.on('device_data', function(data){ // Common data listener.

                    if(data){
                        if(err){throw err};
                        connection.query({
                            sql: 'INSERT INTO deepmes_arduino_count SET data_uuid=?, date_time=?, tool_id=?, param=?, position=?, wafer_count=?',
                            values: [data.data_uuid, data.date_time, data.tool_id, data.param, data.position, data.value]
                        }, function(err, results, fields){
                        }); 
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