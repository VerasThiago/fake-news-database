module.exports = function(app){

	app.get('/user-insert', function(req, res){
		res.render("user/user_insert", {err:""});
	});

	app.get('/users-list', function(req, res){
		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute get_all data function to get users from db
		userModel.get_all(connection, function (err,result) {

			// render index page with json from db
			res.render("user/users_list", {x:result});
		});
	});

	app.post('/save', function (req,res) {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute save_name function to insert int db
		userModel.save_name(data, connection, function(err, result) {
			res.render("user/user_insert", {err : err ? err:"User saved!"});
		});

	});
};