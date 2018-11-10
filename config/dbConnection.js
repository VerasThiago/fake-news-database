const { Client } = require('pg');


var teste = function(){
    
    const client =  new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'fake_news',
        password: 'thiago',
        port: 5432,
    }); 
    
    client.connect(function (err) {
        if (err) {
            console.log('Error in connection');
            return;
        }
        console.log('Connection established');
    });

    return client;
}

module.exports = function(){
    console.log('Auto load done');
    return teste;
};
                