function UserDAO(connection){
    this._connection = connection;
}

UserDAO.prototype.get_all = function(callback){
    // SQL query
    const query = {
        text: 'SELECT * FROM usuario',
    };

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.save_user = function(data, callback){
    // SQL query
    const query = {
        text: 'INSERT INTO usuario (usuario_name)VALUES($1)',
        values: [data['usuario_name']],
    };

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.update_user = function(data, callback){
    // SQL query
    const query = {
        text: 'UPDATE usuario SET usuario_name = $1 WHERE usuario_id = $2',
        values: data,
    };

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.delete_user = function(data, callback){
    // SQL query
    const query = {
        text: 'DELETE FROM usuario WHERE usuario_id = $1',
        values: [data],                                                                         
    };
    
    // callback
    this._connection.query(query, callback);
}


module.exports = function(app){
    return UserDAO;
}

