// some file functions 
const  Functions = require('./../models/Functions');

module.exports.list = (app, req, res) =>{
	
	/**
	 *
	 *  This method render a view passing object with all news in database and all data related with fake news to user update it if necessary
	 *
	 */

	var connection = app.config.dbConnection();

	app.app.models.Fake_newsDAO.get_all_news(connection,(err, result) =>{


		/**
		 *
		 *  get_all_news method returns all news and inside this callback is converted to object of fake news class and pushed to a list of objects
		 *
		 */


		// list of news object
		var news = new Array;

		// news returned from database
		var data = result.rows;

		for(var i = 0; i < data.length; i++){
			
			var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, data[i].id,
														data[i].title, data[i].content,
														data[i].company, data[i].government_power,
														data[i].parties, data[i].intention,
														data[i].type, data[i].propagations);

			news.push(Fake_newsDAO);
		}

		app.app.models.Fake_newsDAO.get_fake_news_data(connection, (err,result) =>{

			/**
			 *
			 *  get_fake_news_data returns list of all companies, political parties ... so user can update his fake news based on this data
			 *
			 */
			
			var data_list = {
				'news' : news,
				'all_company' 				: Functions.string_to_list(result.rows[0].data),
				'all_parties' 				: Functions.string_to_list(result.rows[1].data),
				'all_government_power' 		: Functions.string_to_list(result.rows[2].data),
				'all_fake_news_type' 		: Functions.string_to_list(result.rows[3].data),
				'all_propagation_method' 	: Functions.string_to_list(result.rows[4].data)
			}

			res.render('fake_news/fake_news_list', {data:data_list});
		});
	});

}

module.exports.insert_form = (app, req, res) => {

	/**
	 *
	 *  This method render a view passing object with all data related with fake news to user create his own fake news
	 *	
	 */

	var connection = app.config.dbConnection();

	app.app.models.Fake_newsDAO.get_fake_news_data(connection, (err,result) =>{

		/**
		 *
		 *  get_fake_news_data returns list of all companies, political parties ... so user can choose relation with this data with his own fake news
		 *
		 */

		var data_list = {
			'all_company' 				: Functions.string_to_list(result.rows[0].data),
			'all_parties' 				: Functions.string_to_list(result.rows[1].data),
			'all_government_power' 		: Functions.string_to_list(result.rows[2].data),
			'all_fake_news_type' 		: Functions.string_to_list(result.rows[3].data),
			'all_propagation_method' 	: Functions.string_to_list(result.rows[4].data)
		}

		res.render("fake_news/fake_news_insert_form", { data: data_list });
		
	});
}

module.exports.upload = (app, req, res) => {

	/**
	 *
	 *  This method upload data recieved from user form, insert in database and redirecting to the same page
	 *
	 *	Checks if have list of political parties and propagation method, then transform in 2 lists, with the rest of data instantiate a object from
	 *	fake news class and calls method save_news_db	
     *
     *
	 */

	// data from form
	var data = req.body;

	// lits of parties
	var parties = [];

	// lits of propagations
	var propagations = [];

	if(data.parties){
		// object of parties
		var political_parties = data.parties;

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});
	}

	if(data.propagation_method){
		// object of propagation method
		var propagation_methods = data.propagation_method;

		// walktrough propagation_method and inser into list
		Object.keys(propagation_methods).forEach(function(key){
			propagations.push(propagation_methods[key]);
		});
	}
	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new fake_news
	var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, null, data.title, data.content,
														data.company, data.government_power,
														data.parties, data.fake_news_intention,
														data.fake_news_type, propagations, null);

	Fake_newsDAO.save_news_db(() => {

		/**
         *
         * This method insert object in db then set his own id attribute to id created by database, then insert his relation with political party and propagation method
         * 
		 */

		Fake_newsDAO.save_parties_relation();

		Fake_newsDAO.save_propagation_method_relation();

	}),res.redirect('/fakenews/insert_form');

}

module.exports.edit = (app, req, res) => {

	/**
	 *
	 *  This method upload data recieved from user form, insert in database and redirecting to the same page, but this time the form is a edit form and insert in an existing fake news in database
	 *
	 *	Checks if have list of political parties and propagation method, then transform in 2 lists, with the rest of data instantiate a object from
	 *	fake news class and then checks if delete button was pressed to delete or update	
     *
	 */


	// data from form
	var data = req.body;

	// lits of parties
	var parties = [];

	// lits of propagations
	var propagations = [];

	if(data.parties){
		// object of parties
		var political_parties = data.parties;

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});
	}

	if(data.propagation_method){
		// object of propagation method
		var propagation_methods = data.propagation_method;

		// walktrough propagation_method and inser into list
		Object.keys(propagation_methods).forEach(function(key){
			propagations.push(propagation_methods[key]);
		});
	}
	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new fake_news

	// connection, id ,title, content, company, government_power, parties, intention, type, propagations,files
	var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, data.id, data.title, data.content,
														data.company, data.government_power,
														data.parties, data.fake_news_intention,
														data.fake_news_type, data.propagations, null);

	if(data.delete){
		Fake_newsDAO.delete_fake_news((err,result) => res.redirect('/fakenews/list'));
	}
	else{
		Fake_newsDAO.update_fake_news((err,result) =>res.redirect('/fakenews/list'));
	}

}