module.exports = (app) => {

	app.get('/fakenews/list', (req,res) => {

		//var file = require('./app/models/fileDAO');
		var file_functions = require('./../models/file_functions');
		
		// file path
		var path =  __dirname + '/../../public/uploads/'

		// get connection with db
		var connection = app.config.dbConnection();

		// erase all files before upload all
		file_functions.erase_files(path);

		// get some data from db
		file_functions.get_all_files( connection, (err,result) => {

			if(!err){

			}

			var files = new Array();
			
			result.rows.forEach(function(file, chave){

				var file = new app.app.models.FileDAO(connection, file, path);

				file.download_file();

				files.push(files);

			});
		

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

		// connections with db
		var connection = app.config.dbConnection();

		// file path
		var path =  __dirname + '/../../public/uploads/'

		console.log(file);

		// file functions
		var FileDAO = new app.app.models.FileDAO(connection, file, path);

		// save pc then db
		FileDAO.save_file((err, result) => {

			// debug
			console.log(err ? err:"Arquivo saved!");

			// get back to the insert view
			res.redirect('/fakenews/insert');
		});
	});

	app.post('/fakenews/edit/file', (req, res) => {

		// get file from form
		var file = req.files.upfile;

		// file path
		var path =  __dirname + '/../../public/uploads/'

		// connections with db
		var connection = app.config.dbConnection();


		// data from form
		var data = req.body;


		// file functions
		
		if(data['delete'] == ''){
			FileDAO.delete_file(() => res.redirect('/fakenews/list'));
		}
		else{




			// if have file, upload to pc to later upload on db
			if(file){
				file.mv(path + file.name, (err, res) => err ? file.name = null:console.log("File saved on PC!")); 
				file['id'] =  parseInt(data['id']);
			}

			var FileDAO = new app.app.models.FileDAO(connection, file, path);

			
			// update file
			FileDAO.update_file(() => res.redirect('/fakenews/list'));
		}

	});
}