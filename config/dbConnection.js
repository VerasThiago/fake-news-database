const { Client } = require('pg');


var dbConn = function(){
    
    // client connection
    const client =  new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'fake_news',
        password: 'thiago',
        port: 5432,
    }); 
    
    // aplly connection
    client.connect(function (err) {
        if (err) {
            console.log('Error in connection');
            return;
        }
        console.log('Connection established');
    });

    // return conection
    return client;
}

module.exports = function(){
    console.log('Auto load done');
    return dbConn;
};
                