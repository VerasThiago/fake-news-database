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
	        text: 'SELECT arquivo.arquivo_id AS file_id, arquivo.arquivo_name AS name, extensao.extensao_name AS extension, fake_news.fake_news_title, fake_news.fake_news_id ' +
	              'FROM arquivo, extensao, fake_news ' +
	              'WHERE (arquivo.extensao_id = extensao.extensao_id AND fake_news.fake_news_id = arquivo.fake_news_id) ' +
	              'ORDER BY file_id DESC' 
	    };

	    // callback
	    connection.query(query, callback);
	},
	get_list_to_insert_fake_news: function(connection,  callback)  {
	    // SQL query

	    const query = {
			text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
				  'SELECT array_agg((parties_id,parties_name))::text[]  FROM parties UNION ALL ' +
				  'SELECT array_agg((government_power_id,government_power_name))::text[]  FROM government_power UNION ALL ' +
				  'SELECT array_agg((fake_news_type_id,fake_news_type_name))::text[]  FROM fake_news_type'
		};
	   
	    // callback
	    connection.query(query, callback);
	},
	get_all_news: function(connection, callback){
		// SQL query
	    const query = {
	        text: 'SELECT fake_news.fake_news_id AS id, fake_news.fake_news_title AS title, fake_news.fake_news_content AS content, fake_news.fake_news_intention AS intention, get_company_name(fake_news.company_id) AS company, get_government_power_name(fake_news.government_power_id) AS government_power , get_fake_news_type_name(fake_news.fake_news_type_id) AS type, politycal_parties_relation.parties ' +
	              'FROM politycal_parties_relation,fake_news ' +
	              'WHERE fake_news.fake_news_id = politycal_parties_relation.fake_news_id ' +
	              'ORDER BY fake_news.fake_news_id DESC'
	    };

	    // callback
	    connection.query(query, callback);
	},
	get_news_to_insert_file: function(connection, callback){
		// SQL query
	    const query = {
	        text: 'SELECT array_agg((fake_news_id,fake_news_title, company_id))::text[] AS data FROM fake_news'
	    };

	    // callback
	    connection.query(query, callback);
	},
	get_fake_news_data: function(connection, callback){
		// SQL query
	    const query = {
			text: 'SELECT array_agg((company_id,company_name))::text[] AS data FROM company UNION ALL ' +
			      'SELECT array_agg((government_power_id,government_power_name))::text[]  FROM government_power	UNION ALL ' +
			      'SELECT array_agg((parties_id,parties_name))::text[]  FROM parties UNION ALL ' + 
			      'SELECT array_agg((fake_news_type_id,fake_news_type_name))::text[]  FROM fake_news_type'	
	    };

	    // callback
	    connection.query(query, callback);
	},
	get_penalty_data: function (connection, callback) {
		const query = {
			text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
				  'SELECT array_agg((penalty_type_id,penalty_type_name))::text[]  FROM penalty_type	UNION ALL ' +
				  'SELECT array_agg((fake_news_id,fake_news_title, company_id))::text[]  FROM fake_news'	
		};
		connection.query(query, callback);
	},
	string_to_list: function (data) {

		var data_list = new Array;

		if(data != null){
			data.forEach(function (value, key) {
				data_list.push(value.split('(').join('').split(')').join('').split('"').join('').split(','));
			});
		}
		return data_list;

	},
	get_all_penalties: function (connection, callback){
		// SQL query
		const query = {
			text: 'SELECT fake_news.fake_news_id AS fake_news_id, fake_news.fake_news_title AS fake_news_title, ' +
						 'company.company_name AS company_name, company.company_id AS company_id, ' + 
						 'penalty_type.penalty_type_name AS penalty_type_name, penalty_type.penalty_type_id AS penalty_type_id, ' + 
						 'penalty.penalty_amount AS amount ' +
				  'FROM fake_news, company, penalty_type, penalty '  +
				  'WHERE fake_news.fake_news_id = penalty.fake_news_id AND company.company_id = penalty.company_id AND penalty_type.penalty_type_id = penalty.penalty_type_id ' +
				  'ORDER BY amount DESC'
			};

		// callback
		connection.query(query, callback);

	}
	
};

