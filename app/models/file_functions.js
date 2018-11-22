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
	},
	get_list_to_insert_fake_news: function(connection,  callback)  {
	    // SQL query
	    const query = {
	        text: 'SELECT DISTINCT company_name,parties_name,government_power_name,fake_news_type_name FROM company, parties, government_power, fake_news_type'
	    };

	    // callback
	    connection.query(query, callback);
	},
	get_all_news: function(connection, callback){
		// SQL query
	    const query = {
	        text: 'SELECT fake_news.fake_news_id AS id, fake_news.fake_news_title AS title, fake_news.fake_news_content AS content, fake_news.fake_news_intention AS intention, fake_news.company_id AS company, fake_news.government_power_id AS government_power , fake_news.fake_news_type_id AS type, politycal_parties_relation.parties FROM politycal_parties_relation,fake_news WHERE fake_news.fake_news_id = politycal_parties_relation.fake_news_id;'
	    };

	    // callback
	    connection.query(query, callback);
	}

};

