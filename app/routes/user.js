module.exports = (app) => {

	app.get('/user/insert', (req, res) => {
		res.render("user/user_insert", {err:""});
	});

	app.get('/user/list', (req, res) => {
		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var UserDAO = new app.app.models.UserDAO(connection);

		// execute get_all data function to get users from db and then render page with result
		UserDAO.get_all((req,result) =>	res.render("user/user_list", {users:result}));

	});

	app.post('/user/upload', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// Instantiating user object
		var UserDAO = new app.app.models.UserDAO(connection, data);


		// execute save_name function to insert int db
		UserDAO.save_user((err,result) =>{
			
			console.log('err = ' + err);
			res.redirect("/user/insert")

		});

	});

	app.post('/user/edit', (req,res)  => {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user attribute
		var user = {
			'name' : data['name'],
			'id'   : parseInt(data['id'])
		};

		// Instantiating user object
		var UserDAO = new app.app.models.UserDAO(connection, user);

		if(data['delete'] == ''){
			// deleting user
			UserDAO.delete_user(parseInt(data['usuario_id']), () => res.redirect('/user/list'));
		}
		else{
			// execute save_name function to insert int db
			UserDAO.update_user(() =>	res.redirect("/user/list"));
		}

	});
};