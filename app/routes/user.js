module.exports = (app) => {

	app.get('/user/insert', (req, res) => {
		res.render("user/user_insert", {err:""});
	});

	app.get('/user/list', (req, res) => {
		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute get_all data function to get users from db and then render page with result
		userModel.get_all(connection, (req,result) =>	res.render("user/user_list", {x:result}));

	});

	app.post('/user/upload/user', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute save_name function to insert int db
		userModel.save_user(data, connection, () =>	res.redirect("/user/insert"));

	});

	app.post('/user/edit/user', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		if(data['delete'] == ''){

			// deleting user
			userModel.delete_user(parseInt(data['usuario_id']), connection, () => res.redirect('/user/list'));
		}
		else{
			// reorganizing data
			data = [data['usuario_name'], parseInt(data['usuario_id'])];

			// execute save_name function to insert int db
			userModel.update_user(data, connection, () =>	res.redirect("/user/list"));
		}

	});
};