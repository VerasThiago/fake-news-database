function UserDAO(connection, user){
    this._connection = connection;
    this._user = user;
}

UserDAO.prototype.get_all = function(callback){
    // SQL query
    const query = {
        text: 'SELECT usuario.usuario_id AS id, usuario.usuario_name AS name FROM usuario',
    };

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.save_user = function(callback){
    // SQL query
    const query = {
        text: 'INSERT INTO usuario(usuario_name) VALUES ($1)',
        values: [this._user.name],
    };

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.update_user = function(callback){
    // SQL query
    const query = {
        text: 'UPDATE usuario SET usuario_name = $1 WHERE usuario_id = $2',
        values: [this._user.name, this._user.id],
    }; 

    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.delete_user = function(data, callback){
    // SQL query
    const query = {
        text: 'DELETE FROM usuario WHERE usuario_id = $1',
        values: [this._user.id],                                                                         
    };
    
    // callback
    this._connection.query(query, callback);
}

UserDAO.prototype.get_name = function(data, callback){
    return this._user.name;
}

UserDAO.prototype.get_id = function(data, callback){
    return this._user.id;
}

module.exports = function(app){
    return UserDAO;
}

