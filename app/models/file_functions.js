// Module that removes files
var rimraf = require('rimraf');


module.exports = {

    get_all_files: function(connection, callback)  {

    	/**
		 *	Returns from database all files structured by : id, name, extension, fake news related (tile and id) in order to display in a files list view.
		 *
         * 	This function don't acctually return file data itself, but with the file name we can export from database by calling export function, passing
         *  path + file name so then postgresql can export to the specified path and created that file with that name
		 *	
		 *	Arguments:
		 *	   > connection 
		 *	       The connection with database, necessary to execute query
         *
    	 */


	    const query = {
	        text: 'SELECT arquivo.arquivo_id AS file_id, arquivo.arquivo_name AS name, extensao.extensao_name AS extension, fake_news.fake_news_title, fake_news.fake_news_id ' +
	              'FROM arquivo, extensao, fake_news ' +
	              'WHERE (arquivo.extensao_id = extensao.extensao_id AND fake_news.fake_news_id = arquivo.fake_news_id) ' +
	              'ORDER BY file_id DESC' 
	    };

	    connection.query(query, callback);
	},
	get_all_penalties: function (connection, callback){
		
		/**
		 * Returns from database all penalties structured by : fake news (id, title), company (id, name), penalty type (id, name), amount
		 *												       
		 *	
		 *	Arguments:
		 *		> connection 
		 *	       The connection with database, necessary to execute query
         *
		 */

		const query = {
			text: 'SELECT fake_news.fake_news_id AS fake_news_id, fake_news.fake_news_title AS fake_news_title, ' +
						 'company.company_name AS company_name, company.company_id AS company_id, ' + 
						 'penalty_type.penalty_type_name AS penalty_type_name, penalty_type.penalty_type_id AS penalty_type_id, ' + 
						 'penalty.penalty_amount AS amount ' +
				  'FROM fake_news, company, penalty_type, penalty '  +
				  'WHERE fake_news.fake_news_id = penalty.fake_news_id AND company.company_id = penalty.company_id AND penalty_type.penalty_type_id = penalty.penalty_type_id ' +
				  'ORDER BY amount DESC'
			};

		connection.query(query, callback);

	},
	get_all_news: function(connection, callback){
		
		/**
		 * Returns from database all fake news structured by : id, title, content, intention, company, government power,
		 *												       fake news type, list of political parties and propagation method envolved.
		 *	
		 * This query uses a view to return list of parties and propagatioon menthod envolved
		 *
		 *
		 *	Arguments:
		 *		> connection 
		 *	       The connection with database, necessary to execute query
         *
		 */

	    const query = {
	        text: 'SELECT fake_news.fake_news_id AS id, fake_news.fake_news_title AS title, fake_news.fake_news_content AS content, ' + 
	        			' fake_news.fake_news_intention AS intention, get_company_name(fake_news.company_id) AS company, ' + 
	        			' get_government_power_name(fake_news.government_power_id) AS government_power , get_fake_news_type_name(fake_news.fake_news_type_id) AS type, ' +
	        			' politycal_parties_relation.parties, propagation_method_relation.propagations ' +
	              'FROM politycal_parties_relation,fake_news, propagation_method_relation  ' +
	              'WHERE fake_news.fake_news_id = politycal_parties_relation.fake_news_id AND fake_news.fake_news_id = propagation_method_relation.fake_news_id ' +
	              'ORDER BY fake_news.fake_news_id DESC'
	    };

	    connection.query(query, callback);
	},
	get_file_data: function(connection, callback){
		
		/**
		 *	Returns list of tuple (id,name) of fake news so that user can choose wich fake news he's gonna insert a file.
		 *
		 *	Arguments:
		 *		> connection 
		 *	       The connection with database, necessary to execute query
         *
		 */

	    const query = {
	        text: 'SELECT array_agg((fake_news_id,fake_news_title))::text[] AS data FROM fake_news'
	    };

	    connection.query(query, callback);
	},
	get_fake_news_data: function(connection, callback){
		
		/**
		 *	Returns list of pair (id,name) of entities relateded in fake news creation.
		 *	Data returned from this method is :
		 *      - List of companies that publish news
		 *      - List of political parties that can be envolved in a fake news
		 *		- List of government power that can be affected by a fake news
		 *		- List of fake news type ie.: Manipulated news, invented news
		 *		- List of propagation method ie.: Social media, television, radio
		 *
		 *
		 *	Arguments:
		 *		> connection 
		 *	       The connection with database, necessary to execute query
         *
		 */


	    const query = {
			text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
				  'SELECT array_agg((parties_id,parties_name))::text[]  FROM parties UNION ALL ' +
				  'SELECT array_agg((government_power_id,government_power_name))::text[]  FROM government_power UNION ALL ' +
				  'SELECT array_agg((fake_news_type_id,fake_news_type_name))::text[]  FROM fake_news_type UNION ALL ' +
				  'SELECT array_agg((propagation_method_id,propagation_method_name))::text[]  FROM propagation_method'
		};

	    connection.query(query, callback);
	},
	get_penalty_data: function (connection, callback) {

		/**
		 *	Returns list of pair (id,name) of entities relateded in fake news creation.
		 *	Data returned from this method is :
		 *      - List of companies that published the news
		 *		- List of penalty type ie.: Moral damage
		 *		- List of fake news that was published by a company
		 *
		 *
		 *	Arguments:
		 *		> connection 
		 *	       The connection with database, necessary to execute query
         *
		 */

		const query = {
			text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
				  'SELECT array_agg((penalty_type_id,penalty_type_name))::text[]  FROM penalty_type	UNION ALL ' +
				  'SELECT array_agg((fake_news_id,fake_news_title, company_id))::text[]  FROM fake_news'	
		};

		connection.query(query, callback);
	},
    erase_files: function(path) {

    	/**
		 *	Deletes all files inside a folder specified by a path
         *
		 *	
		 *	Arguments:
		 *	   > path : string
		 *	       The path of server folder, necessary to rimraf find folder to erase all files
		 *
    	 */


		/**
		 * Add * to the end of the path to specify that all files inside this path gonna be deleted
		 */

		path = path + '*';
		rimraf(path,() => { });
	},
	string_to_list: function (data) {


		/**
		 * Converts a string created by sql array (don't know why sql returns array in string ???) 
		 * Just removes all '(', ')', '"' and split by ','
		 *
		 *	Arguments:
		 *		> data : string
		 *	       The array string that gonna be converted in original array
		 *
		 */

		var data_list = new Array;

		if(data != null){
			data.forEach(function (value, key) {
				data_list.push(value.split('(').join('').split(')').join('').split('"').join('').split(','));
			});
		}
		return data_list;
	}
};

