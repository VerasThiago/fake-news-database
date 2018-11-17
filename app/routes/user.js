module.exports = function(app){

	app.get('/user/insert', function(req, res){
		res.render("user/user_insert", {err:""});
	});

	app.get('/user/list', function(req, res){
		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute get_all data function to get users from db and then render page with result
		userModel.get_all(connection, (req,result) =>	res.render("user/user_list", {x:result}));

	});

	app.post('/user/upload/user', function (req,res) {

		// get data from form
		var data = req.body;

		// get connection with db
		var connection = app.config.dbConnection();

		// user functions
		var userModel = app.app.models.userModel;

		// execute save_name function to insert int db
		userModel.save_name(data, connection, () =>	res.redirect("/user/insert"));

	});
};