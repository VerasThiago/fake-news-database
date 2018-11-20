module.exports = {
    erase_files: function(path) {
		var rimraf = require('rimraf');
		// erase all files inside this folder
		path = path + '*';

		rimraf(path,() => { });
	},
    get_all_files: function(connection, callback)  {
	    // SQL query
	    const query = {
	        text: 'SELECT arquivo.arquivo_id AS id, arquivo.arquivo_name AS name, extensao.extensao_name AS extension, arquivo.fake_news_id FROM arquivo, extensao WHERE (arquivo.extensao_id = extensao.extensao_id)'
	    };

	    // callback
	    connection.query(query, callback);
	}
};