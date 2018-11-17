module.exports = function(app){

	app.get('/fake-news-list', function(req,res){

		// get connection with db
		var connection = app.config.dbConnection();

		// get file functions
		var fileModel = app.app.models.fileModel;

		// file path
		var path =  __dirname + '/../../public/uploads/*'
		

		// erase all files before upload all
		fileModel.erase_file(path, function(err, result){
			if(!err)
				throw err;
		});

		// get all files from db
		fileModel.get_all_files(connection, function (err,result) {

			fileModel.upload_all_files(connection, __dirname + '/../../public/uploads/', result);

			// render files list page with json from db
			res.render("fake_news/fake_news_list", {x:result})
		});
	});

	app.get('/fake-news-insert', function(req,res){

		// render insert new fake-news page
		res.render('fake_news/fake_news_insert', {err:""})
	});

	app.post('/upload', function(req,res){
		// get file from form
		var file = req.files.upfile;

		// if file exist
		if(!file)
			res.render('fake_news/fake_news_insert', {err:"Choose your file please!"});

		// file functions
		var fileModel = app.app.models.fileModel;

		// file path
		var path =  __dirname + '/../../public/uploads/'

		// connections with db
		var connection = app.config.dbConnection();

		// just to debug
		var alert = ['','Nem tentou com BD'];

		// save file on pc
		fileModel.save_file_pc(file, path, function(err, result){

			// alert message based on save pc error
			alert[0] = err ? err:" Deu bom com o upload no PC";

			// if got error so return that error
			if(err){
				// render upload page
				res.render('fake_news/fake_news_insert', {err:alert} );
			}

			// else try to save on db
			else{

				// file function to save on db
				fileModel.save_file_db(path, file, alert, connection, function(err, result){

					// alert message based on save db error
					alert[1] = err ? err:" Deu bom com o upload no DB";

					// render upload page
					res.render('fake_news/fake_news_insert', {err:alert} );

				});
			}
		});
	});
}