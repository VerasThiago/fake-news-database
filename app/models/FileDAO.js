
function FileDAO(connection, file, path){
    this._connection = connection;
    this._file = file;
    this._path = path;
}

FileDAO.prototype.save_file_db = function(callback)  {
    // SQL query
    const query = {
        text: "SELECT insert_file_db(get_extension_id($1), $2, 18, $3)",
        values: [this._file.mimetype, this._file.name , this._path + this._file.name]
    };

    // callback
    this._connection.query(query, callback);
}

FileDAO.prototype.save_file = function(callback)  {
   
    // move to a folder in server
    this._file.mv(this._path + this._file.name, () => this.save_file_db(callback));
}

FileDAO.prototype.download_file = function()  {
    
    // SQL query
    const query = {
        text:   'SELECT lo_export(arquivo.arquivo_content, $1) FROM arquivo WHERE arquivo.arquivo_id = $2',                                                                                     
        values: [this._path + this._file.name, this._file.id]
    };
    // callback
    this._connection.query(query);
    
}

FileDAO.prototype.update_file = function(callback)  {

        //SQL query
        const query = {
            text:   'SELECT update_file($1, $2, $3, $4)',
            values: [this._file.name, this._fake_news_id, this._path, this._file.id]

        };

        // callback
        this._connection.query(query, callback);
}

FileDAO.prototype.delete_file = function(callback)  {
    //SQL query
    const query = {
        text: 'DELETE FROM arquivo WHERE arquivo.arquivo_id = $1',
        values: [this._file.id]                                                                      
    };
    
    // callback
    this._connection.query(query, callback);
}

FileDAO.prototype.get_name = function()  {
    return this._file.name;
}


module.exports = function(app){
    return FileDAO;
}

