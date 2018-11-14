module.exports = function (app) {

    this.get_all = function(connection, callback){
        connection.query('SELECT * FROM usuario', callback);
    }

    this.save_name = function(name, connection, callback) {
        console.log(name['usuario_name'] );
        const query = {
            text: 'INSERT INTO usuario (usuario_name)VALUES($1)',
            values: [name['usuario_name']],
        };

        // callback
        connection.query(query, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
        });
    }

    this.get_file = function(connection, callback){
        connection.query('SELECT * FROM arquivo', callback);
    }

    return this;
}