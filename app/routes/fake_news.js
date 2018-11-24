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

			var data = result.rows;

			for(var i = 0; i < data.length; i++){
				
				// instantiating fake_news object
				var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, data[i].id,
															data[i].title, data[i].content,
															data[i].company, data[i].government_power,
															data[i].parties, data[i].intention,
															data[i].type);

				news.push(Fake_newsDAO);;
			}

			file_functions.get_fake_news_data(connection, (err,result) =>{

				var all_company = new Array;

				var all_government_power = new Array;

				var all_parties = new Array;

				var all_fake_news_type = new Array;

				result.rows[0].data.forEach(function(company, chave){
					all_company.push(company.split('(').join('').split(')').join('').split(','));
				});

				result.rows[1].data.forEach(function(government_power, chave){
					all_government_power.push(government_power.split('(').join('').split(')').join('').split(','));
				});

				result.rows[2].data.forEach(function(parties, chave){
					all_parties.push(parties.split('(').join('').split(')').join('').split(','));
				});

				result.rows[3].data.forEach(function(type, chave){
					all_fake_news_type.push(type.split('(').join('').split(')').join('').split(','));
				});

				var data_list = {
					'news' : news,
					'all_company' : all_company,
					'all_government_power' : all_government_power,
					'all_parties' : all_parties,
					'all_fake_news_type' : all_fake_news_type
				}

				res.render('fake_news/fake_news_list', {data:data_list});
			});




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
		var political_parties = data.parties;

		// lits of parties
		var parties = [];

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new fake_news
		var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, null, data.title, data.content,
															data.company, data.government_power,
															parties, data.fake_news_intention ? true:false,
															data.fake_news_type);


		// save fake_news in database
		Fake_newsDAO.save_news_db(() => {

			// save political party relation
			Fake_newsDAO.save_parties_relation();

		}),res.redirect('/fakenews/insert');

	});

	app.post('/fakenews/edit/fake_news', (req,res) => {


		// form data
		var data = req.body;

		// object of parties
		var political_parties = data.parties;

		// lits of parties
		var parties = [];

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new fake_news
		var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, data.id,
															data.title, data.content,
															data.company_id, data.government_power_id, 
															parties,data.intention, data.fake_news_type_id);

		if(data.delete){
			Fake_newsDAO.delete_fake_news((err,result) => res.redirect('/fakenews/list'));
		}
		else{
			Fake_newsDAO.update_fake_news((err,result) => res.redirect('/fakenews/list'));
		}

	});
}