module.exports = function(app){
	
	app.get('/', function(req, res){
		
		var connection = app.config.dbConnection();
		var userModel = app.app.models.userModel;
		userModel.get_all(connection, function (err,result) {
			res.render("home/index", {x:result})
		});

	});

	app.post('/salvar', function (req,res) {
		var name = req.body;
		var connection = app.config.dbConnection();
		var userModel = app.app.models.userModel;

		userModel.save_name(name, connection, function(err, result) {
				res.render("home/index");
		});

	})
};