module.exports = function (app) {

    this.get_all = function(connection, callback){
        connection.query('SELECT * FROM usuario', callback);
    }

    this.save_name = function(name, connection, callback) {

        const query = {
            text: 'INSERT INTO users(name) VALUES($1)',
            values: name,
        }

        // callback
        connection.query(query, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
        })

    }

    return this;
}