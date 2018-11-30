// some file functions 
const  file_functions = require('./../models/file_functions');

module.exports.list = (app, req, res) =>{
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
			all_company = file_functions.string_to_list(result.rows[0].data);

			var all_government_power = new Array;
			all_government_power = file_functions.string_to_list(result.rows[1].data);

			var all_parties = new Array;
			all_parties = file_functions.string_to_list(result.rows[2].data);

			var all_fake_news_type = new Array;
			all_fake_news_type = file_functions.string_to_list(result.rows[3].data); 

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

}

module.exports.insert_form = (app, req, res) => {

	// connections with db
	var connection = app.config.dbConnection();

	file_functions.get_list_to_insert_fake_news(connection, (err,result) =>{

		if(err){
			return res.send(err);
		}
		else{	

			var data_list = {
				'all_company': file_functions.string_to_list(result.rows[0].data),
				'all_parties': file_functions.string_to_list(result.rows[1].data),
				'all_government_power': file_functions.string_to_list(result.rows[2].data),
				'all_fake_news_type': file_functions.string_to_list(result.rows[3].data)
			}
			
			res.render("fake_news/fake_news_insert_form", { data: data_list });
		}
		
	});
}

module.exports.upload = (app, req, res) => {

	// data from form
	var data = req.body;


	// lits of parties
	var parties = [];

	if(data.parties){
		// object of parties
		var political_parties = data.parties;

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});
	}
	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new fake_news
	var Fake_newsDAO =  new app.app.models.Fake_newsDAO(connection, null, data.title, data.content,
														data.company, data.government_power,
														data.parties, data.fake_news_intention,
														data.fake_news_type, null);

	// save fake_news in database
	Fake_newsDAO.save_news_db(() => {

		// save political party relation
		Fake_newsDAO.save_parties_relation();

	}),res.redirect('/fakenews/insert_form');

}

module.exports.edit = (app, req, res) => {
	// form data
	var data = req.body;

	// lits of parties
	var parties = [];

	if(data.parties){
		// object of parties
		var political_parties = data.parties;

		// walktrough parties and inser into list
		Object.keys(political_parties).forEach(function(key){
			parties.push(political_parties[key]);
		});
	}

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
		Fake_newsDAO.update_fake_news((err,result) => {
			console.log('error = ' + err);
			res.redirect('/fakenews/list')
		});
	}

}