// some file functions 
const file_functions = require('./../models/file_functions');


module.exports.list = (app, req, res) =>{
	// get connection with db
	var connection = app.config.dbConnection();


	file_functions.get_all_penalties(connection, (err, result) => {

		console.log('err = ' + err);

		var penalties = new Array;

		var data = result.rows;

		for (var i = 0; i < data.length; i++) {

			// instantiating penalty object
			var PenaltyDAO = new app.app.models.PenaltyDAO(connection, 
															data[i].fake_news_id, data[i].fake_news_title,
															data[i].company_id,	data[i].company_name,
															data[i].penalty_type_id, data[i].penalty_type_name,
															data[i].amount);

			penalties.push(PenaltyDAO);
		}


		file_functions.get_penalty_data(connection, (err, result) => {
			if (err)
				return res.send(err);
			else {

				var all_company = new Array;
				all_company = file_functions.string_to_list(result.rows[0].data);

				var all_penalty_type = new Array;
				all_penalty_type = file_functions.string_to_list(result.rows[1].data);

				var all_fake_news = new Array;
				all_fake_news = file_functions.string_to_list(result.rows[2].data);

				var data_list = {
					'penalties' : penalties,
					'all_company': all_company,
					'all_penalty_type': all_penalty_type,
					'all_fake_news': all_fake_news
				}
				

				res.render("penalty/penalty_list", { data: data_list });
			}
		});

	});

}

module.exports.insert_form = (app, req, res) =>{
	// get connection with db
	var connection = app.config.dbConnection();


	file_functions.get_penalty_data(connection, (err,result) =>{
		if(err)
			return res.send(err);
		else{	

			var all_company = new Array;
			all_company = file_functions.string_to_list(result.rows[0].data);

			var all_penalty_type = new Array;
			all_penalty_type = file_functions.string_to_list(result.rows[1].data); 

			var all_fake_news = new Array;
			all_fake_news = file_functions.string_to_list(result.rows[2].data); 

			var data_list = {
				'all_company': all_company,
				'all_penalty_type': all_penalty_type,
				'all_fake_news': all_fake_news
			}

			res.render("penalty/penalty_insert_form", { data: data_list });
		}
	});
	
}

module.exports.upload = (app, req, res) =>{

	// data from form
	var data = req.body;

	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new penalty
	var PenaltyDAO = new app.app.models.PenaltyDAO(connection, data.fake_news, null, data.company, null, data.penalty_type, null,  data.amount);


	PenaltyDAO.insert_db((err, result) => res.redirect("/penalty/insert_form"));
}

module.exports.edit = (app, req, res) =>{
	
	// form data
	var data = req.body;

	// connections with db
	var connection = app.config.dbConnection();


	// instantiating new penalty
	var PenaltyDAO = new app.app.models.PenaltyDAO(connection, [data._fake_news_id, data.fake_news_id], null,
												  [data._company_id, data.company_id], null,
												  [data._penalty_type_id, data.penalty_type_id],
												  null, data.amount);


	if(data.delete){
		PenaltyDAO.delete_penalty((err, result) => res.redirect('/penalty/list'));
	}
	else{
		PenaltyDAO.update_penalty((err, result) => res.redirect('/penalty/list'));
	}
}
