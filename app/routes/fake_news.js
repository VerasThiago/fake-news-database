module.exports = (app) => {

	app.get('/fakenews/list', (req,res) => {

		// get connection with db
		var connection = app.config.dbConnection();

		// get file functions
		var fileModel = app.app.models.fileModel;

		// file path
		var path =  __dirname + '/../../public/uploads/*'
		

		// erase all files before upload all
		//fileModel.erase_file(path);

		// get some data from db
		fileModel.get_all_files(connection, (err,result) => {

			// donwload all files from db
			if(!err){
				fileModel.download_all_files(connection, __dirname + '/../../public/uploads/', result);
			}

			// render files list page with json from db
			res.render("fake_news/fake_news_list", {x:result})
		});
	});

	app.get('/fakenews/insert', (req,res) => {
		// render insert new fake-news page
		res.render('fake_news/fake_news_insert')
	});

	app.post('/fakenews/upload/file', (req,res) => {
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

		// save pc then db
		fileModel.save_file(file, path, connection, (err, result) => {

			// debug
			console.log(err ? err:"Arquivo saved!");

			// get back to the insert view
			res.redirect('/fakenews/insert');
		});
	});

	app.post('/fakenews/edit/file', (req, res) => {

		// file functions
		var fileModel = app.app.models.fileModel;

		// get file from form
		var file = req.files.upfile;

		// file path
		var path =  __dirname + '/../../public/uploads/'

		// connections with db
		var connection = app.config.dbConnection();

		// data from form
		var data = req.body;

		if(data['delete'] == ''){
			fileModel.delete_file(connection, parseInt(data['arquivo_id']), () => res.redirect('/fakenews/list'));
		}
		else{

			// if have file, upload to pc to later upload on db
			if(file){
				file.mv(path + file.name, (err, res) => err ? file.name = null:console.log("File saved on PC!")); 
			}

			// reorganize data to array of name, id and filename;
			var data = [data['arquivo_name'] == '' ?null:data['arquivo_name'], null, file ? path + file.name:null,  parseInt(data['arquivo_id'])];

			// update file
			fileModel.update_file(connection, data, () => res.redirect('/fakenews/list'));
		}

	});
}