// some file functions 
const Functions = require('./../models/Functions');



module.exports.list = (app, req, res) =>{

	/**
	 *
	 *  This method render a view passing object with all penalties in database and all data related with penalty to user update it if necessary
	 *
	 */

	// get connection with db
	var connection = app.config.dbConnection();


	app.app.models.PenaltyDAO.get_all_penalties(connection, (err, result) => {

		/**
		 *
		 *  get_all_penalties method returns all penalties and inside this callback is converted to object of penalty class and pushed to a list of objects
		 *
		 */


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


		app.app.models.PenaltyDAO.get_penalty_data(connection, (err, result) => {

			/**
			 *
			 *  get_penalty_data returns list of all companies, penalty types and fake news so user can update his penalty based on this data
			 *
			 */ 

			var data_list = {
				'penalties' 		: penalties,
				'all_company'		: Functions.string_to_list(result.rows[0].data),
				'all_penalty_type'	: Functions.string_to_list(result.rows[1].data),
				'all_fake_news'		: Functions.string_to_list(result.rows[2].data)
			}
			
			res.render("penalty/penalty_list", { data: data_list });
		});

	});

}

module.exports.insert_form = (app, req, res) =>{

	/**
	 *
	 *  This method render a view passing object with all data related with penalty to user create his own penalty
	 *	
	 */

	
	var connection = app.config.dbConnection();

	app.app.models.PenaltyDAO.get_penalty_data(connection, (err,result) =>{

		/**
		 *
	     *  get_penalty_data returns list of all companies, penalty types and fake news so user can create his own penalty
		 *
		 */

		var data_list = {
			'all_company': Functions.string_to_list(result.rows[0].data),
			'all_penalty_type': Functions.string_to_list(result.rows[1].data),
			'all_fake_news': Functions.string_to_list(result.rows[2].data)
		}

		res.render("penalty/penalty_insert_form", { data: data_list });
	});
	
}

module.exports.upload = (app, req, res) =>{

	/**
	 *
	 *  This method upload data recieved from user form, insert in database and redirecting to the same page
	 *
	 */


	// data from form
	var data = req.body;

	var connection = app.config.dbConnection();

	var PenaltyDAO = new app.app.models.PenaltyDAO(connection, data.fake_news, null, data.company, null, data.penalty_type, null,  data.amount);

	PenaltyDAO.save_penalty_db((err, result) => {res.redirect("/penalty/insert_form")});
}

module.exports.edit = (app, req, res) =>{

	/**
	 *
	 *  This method upload data recieved from user form, insert in database and redirecting to the same page, but this time the form is a edit form and insert in an existing penalty in database
	 *
	 */
	
	// form data
	var data = req.body;

	// connections with db
	var connection = app.config.dbConnection();


	// instantiating new penalty
	var PenaltyDAO = new app.app.models.PenaltyDAO(connection, [data._fake_news_id, data.fake_news_id], null,
												  [data._company_id, data.company_id], null,
												  [data._penalty_type_id, data.penalty_type_id],
												  null, data.amount);


	PenaltyDAO.update_penalty((err, result) => res.redirect('/penalty/list'));
}


module.exports.delete = (app, req, res) => {

	/**
	 *
	 *  This method deletes penalty that matches with 3 id' recieved from user form,
	 *
	 */

	data = req.body;

	//return res.send(data);

	var connection = app.config.dbConnection();

	//connection, fake_news_id, fake_news_title, company_id, company_name, penalty_type_id, penalty_type_name, amount

	var PenaltyDAO = new app.app.models.PenaltyDAO(connection, data._fake_news_id, null,
												  data._company_id, null,data._penalty_type_id);

	PenaltyDAO.delete_penalty((err, result) => res.redirect('/penalty/list'));

}