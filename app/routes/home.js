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

	});

	app.get('/teste', function(req,res){
  		res.render("home/upload", {err:""})
	});

	app.post('/upload', function(req,res){
		var file = req.files.upfile;
		console.log(req.files);
		if(file){
			var fileModel = app.app.models.fileModel;
			fileModel.save_file_pc(file, __dirname + '/../../public/uploads/', function(err,result){
				if(err)
					alert = 'File Upload Failed : ' + err
				else
					alert = 'File Upload Success!'
				res.render(__dirname + '/../views/home/upload', {err:alert})
			});
		}
		else {
			res.render(__dirname + '/../views/home/upload', {err:"Choose your file please!"});
		};
	});

	app.post('/db/upload', function(req, res){
		var file = req.files;
		var fileModel = app.app.models.fileModel;
		var connection = app.config.dbConnection();
		if(file){
			fileModel.save_file_db(file, connection, function(err,result){
				res.send('ERR = ' + err);
			});
		}
	});
};