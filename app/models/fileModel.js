var rimraf = require('rimraf');

module.exports = function (app) {

	this.save_file_db = function(file, path, connection, callback){

		// SQL query
        const query = {
        	text: "SELECT insert_file_db(get_extension_id($1),($2),7,$3)",
            values: [file.mimetype, file.name,path + file.name]
        };

        // callback
        connection.query(query, callback);
	}

	this.save_file = function(file, path, connection, callback){

		// get file name
		name = file.name,

		// move to a folder in server
		file.mv(path + name, () => this.save_file_db(file, path, connection, callback));
		
	}

	this.get_all_files = function(connection, callback){

		// SQL query
        const query = {
            text: 'SELECT arquivo.arquivo_id, arquivo.arquivo_name, extensao.extensao_name, arquivo.fake_news_id FROM arquivo, extensao WHERE (arquivo.extensao_id = extensao.extensao_id)'
        };

        // callback
        connection.query(query, callback);
    }

    this.download_all_files = function(connection, path, files){

    	
    	for(var i = 0; i < files.rows.length; i++){
    		// SQL query
	        const query = {
				text:	'SELECT lo_export(arquivo.arquivo_content, \'' + path + files.rows[i].arquivo_name + '\') FROM arquivo WHERE arquivo.arquivo_id = ' + files.rows[i].arquivo_id 																						 
	        };
	        // callback
	        connection.query(query);
    	}

    }

    this.update_file = function(connection, data, callback){
    	//SQL query
    	const query = {
			text:	'SELECT update_file($1, $2, $3, $4)',
			values: data 																		 
        };

        // callback
	    connection.query(query, callback);
    }

    this.erase_file = function(path){

    	// erase all files inside this folder
    	rimraf(path, function () {	 });
    }

    this.delete_file = function(connection, id, callback){
    	//SQL query
    	const query = {
			text: 'DELETE FROM arquivo WHERE arquivo.arquivo_id = $1',
			values: [id] 																		 
        };
        
        // callback
	    connection.query(query, callback);
    }

	return this;
}