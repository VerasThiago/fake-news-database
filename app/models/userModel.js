module.exports = function (app) {

    this.get_all = function(connection, callback){

        // SQL query
        const query = {
            text: 'SELECT * FROM usuario',
        };

        // callback
        connection.query(query, callback);
    }

    this.save_name = function(name, connection, callback) {
        
        // SQL query
        const query = {
            text: 'INSERT INTO usuario (usuario_name)VALUES($1)',
            values: [name['usuario_name']],
        };

        // callback
        connection.query(query, callback);
    }

    this.get_file = function(connection, callback){

        // SQL query
        const query = {
            text: 'SELECT * FROM arquivo',
        };

        // callback
        connection.query(query, callback);
    }

    return this;
}

