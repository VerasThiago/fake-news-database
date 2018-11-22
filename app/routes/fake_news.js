// some file functions 
const  file_functions = require('./../models/file_functions');

// file path
const path =  __dirname + '/../../public/uploads/'

module.exports = (app) => {

	app.get('/fakenews/list', (req,res) => {

		// get connection with db
		var connection = app.config.dbConnection();


		file_functions.get_all_news(connection,(err, result) =>{

			var news = new Array;

			for(var i = 0; i < result.rows.length; i++){
				
				// instantiating fake_news object
				var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, result.rows[i]['id'],
															result.rows[i]['title'], result.rows[i]['content'],
															result.rows[i]['company'], result.rows[i]['government_power'],
															[], result.rows[i]['intention'],
															result.rows[i]['type'],[]);

				news.push(Fake_newsDAO);;
			}


			return res.render('fake_news/fake_news_list', {news:news});

			for(var fake_news of news){



			}

		});
	});

	app.get('/fakenews/insert', (req,res) => {

		// connections with db
		var connection = app.config.dbConnection();


		file_functions.get_list_to_insert_fake_news(connection, (err,result) =>{


			var data = {
				'company' : [],
				'parties' : [],
				'government_power' : [],
				'fake_news_type' : []
			};

			result.rows.forEach(function(aux, chave){

				if( ! data['company'].includes(aux['company_name']))
					data['company'].push(aux['company_name']);

				if( ! data['parties'].includes(aux['parties_name']))
					data['parties'].push(aux['parties_name']);

				if( ! data['government_power'].includes(aux['government_power_name']))
					data['government_power'].push(aux['government_power_name']);

				if( ! data['fake_news_type'].includes(aux['fake_news_type_name']))
					data['fake_news_type'].push(aux['fake_news_type_name']);

			});

			// render insert new fake-news page
			res.render('fake_news/fake_news_insert', {data:data});
		});

	});

	app.post('/fakenews/upload/fake_news', (req,res) => {

		// data from form
		var data = req.body;

		// object of parties
		var political_parties = data['parties'];

		// lits of parties
		var parties = [];

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new fake_news
		var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, null, data['title'], data['content'],
															data['company'], data['government_power'],
															parties, data['intention'] == "on",
															data['fake_news_type']);

		// save fake_news in database
		Fake_newsDAO.save_news_db(() => {

			// save political party relation
			Fake_newsDAO.save_parties_relation()

		}),res.redirect('/fakenews/insert');

	});

	app.post('/fakenews/edit/fake_news', (req,res) => {


	});
}