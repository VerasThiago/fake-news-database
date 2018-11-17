var rimraf = require('rimraf');

module.exports = function (app) {

	this.save_file_pc = function(file, path, callback){

		// get file name
		name = file.name,

		// move to a folder in server
		file.mv(path + name, callback);
	}

	this.save_file_db = function(path, file, alert, connection, callback){

		// SQL query
        const query = {
        	text: "SELECT insert_file_db(get_extension_id($1),($2),7,$3)",
            values: [file.mimetype,file.name,path + file.name]
        };

        // callback
        connection.query(query, callback);
	}
	this.get_all_files = function(connection, callback){

		// SQL query
        const query = {
            text: 'SELECT arquivo.arquivo_id, arquivo.arquivo_name, extensao.extensao_name, arquivo.fake_news_id FROM arquivo, extensao WHERE (arquivo.extensao_id = extensao.extensao_id)'
        };

        // callback
        connection.query(query, callback);
    }

    this.upload_all_files = function(connection, path, files){

    	
    	for(var i = 0; i < files.rows.length; i++){


    		// SQL query
	        const query = {
				text:	'SELECT lo_export(arquivo.arquivo_content, \'' + path + files.rows[i].arquivo_name + '\') FROM arquivo WHERE arquivo.arquivo_id = ' + files.rows[i].arquivo_id 																						 
	        };

	        // callback
	        connection.query(query);
    	}

    }

    this.erase_file = function(path){

    	// erase all files inside this folder
    	rimraf(path, function () {	 });
    }

	return this;
}