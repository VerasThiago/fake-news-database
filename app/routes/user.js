module.exports = (app) => {

	app.get('/user/insert', (req, res) => {
		res.render("user/user_insert", {err:""});
	});

	app.get('/user/list', (req, res) => {
		// get connection with db
		var connection = app.config.dbConnection();

		console.log('teste de connection = '+ connection);

		// user functions
		var UserDAO = new app.app.models.UserDAO(connection);

		// execute get_all data function to get users from db and then render page with result
		UserDAO.get_all((req,result) =>	res.render("user/user_list", {x:result}));

	});

	app.post('/user/upload/user', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var UserDAO = new app.app.models.UserDAO(connection);

		// execute save_name function to insert int db
		UserDAO.save_user(data, () =>	res.redirect("/user/insert"));

	});

	app.post('/user/edit/user', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var UserDAO = new app.app.models.UserDAO(connection);

		if(data['delete'] == ''){

			// deleting user
			UserDAO.delete_user(parseInt(data['usuario_id']), () => res.redirect('/user/list'));
		}
		else{
			// reorganizing data
			data = [data['usuario_name'], parseInt(data['usuario_id'])];

			// execute save_name function to insert int db
			UserDAO.update_user(data, () =>	res.redirect("/user/list"));
		}

	});
};