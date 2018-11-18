module.exports = function (app) {

    this.get_all = function(connection, callback){

        // SQL query
        const query = {
            text: 'SELECT * FROM usuario',
        };

        // callback
        connection.query(query, callback);
    }

    this.save_user = function(data, connection, callback) {
        
        // SQL query
        const query = {
            text: 'INSERT INTO usuario (usuario_name)VALUES($1)',
            values: [data['usuario_name']],
        };

        // callback
        connection.query(query, callback);
    }

    this.update_user = function(data, connection, callback){

        // SQL query
        const query = {
            text: 'UPDATE usuario SET usuario_name = $1 WHERE usuario_id = $2',
            values: data,
        };

        // callback
        connection.query(query, callback);
    }

    this.delete_user = function(data, connection, callback){

        // SQL query
        const query = {
            text: 'DELETE FROM usuario WHERE usuario_id = $1',
            values: [data],                                                                         
        };
        
        // callback
        connection.query(query, callback);
    }


    return this;
}

