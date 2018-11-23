
function FileDAO(connection, file_id, file_name, extension_id, extension_name,  fake_news_id, path){
    this._connection = connection;
    this._file_id = file_id;
    this._file_name = file_name;
    this._extension_id  = extension_id;
    this._extension_name = extension_name;
    this._fake_news_id  = fake_news_id;
    this._path = path;

}

FileDAO.prototype.save_file_db = function(callback)  {
    // SQL query
    const query = {
        text: "SELECT insert_file_db(get_extension_id('" + this._extension_name + "'),'" + this._file_name + "'," + this._fake_news_id + ",'" + this._path + this._file_name + "')"
    };

    // callback
    this._connection.query(query, callback);
    
}

FileDAO.prototype.save_file = function(file, callback)  {
   
    // move to a folder in server
    file.mv(this._path + this._file_name, () => this.save_file_db(callback));
}

FileDAO.prototype.download_file = function()  {
    
    // SQL query
    const query = {
        text:   'SELECT lo_export(arquivo.arquivo_content, $1) FROM arquivo WHERE arquivo.arquivo_id = $2',                                                                                     
        values: [this._path + this._file_name, this._file_id]
    };
    // callback
    this._connection.query(query);
    
}

FileDAO.prototype.update_file = function(callback)  {

        //SQL query
        const query = {
            text:   'SELECT update_file($1, $2, $3, $4)',
            values: [this._file_name, this._fake_news_id, this._path, this._file_id]
        };

        console.log('VAUES = ' + query.values);

        // callback
        this._connection.query(query, callback);
}

FileDAO.prototype.delete_file = function(callback)  {
    //SQL query
    const query = {
        text: 'DELETE FROM arquivo WHERE arquivo.arquivo_id = $1',
        values: [this._file_id]                                                                      
    };
    
    // callback
    this._connection.query(query, callback);
}

FileDAO.prototype.get_name = function()  {
    return this._file_name;
}


module.exports = function(app){
    return FileDAO;
}

