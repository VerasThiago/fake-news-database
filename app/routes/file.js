// some file functions 
const  file_functions = require('./../models/file_functions');

// file path
const path =  __dirname + '/../../public/uploads/'

module.exports = (app) => {

	app.get('/file/list', (req,res) => {

			// get connection with db
			var connection = app.config.dbConnection();

			// erase all files before upload all
			file_functions.erase_files(path);

			// get some data from db
			file_functions.get_all_files( connection, (err,result) => {

				if(!err){

					// walking through all files
					result.rows.forEach(function(file, chave){

						// instantiating new file
						var fileDAO = new app.app.models.FileDAO(connection, file, path);

						// donwload file to server
						fileDAO.download_file();

					});
				}
				
				// render files list page with json from db
				res.render("file/file_list", {files:result})
			});
		});

		app.get('/file/insert', (req,res) => {
			// render insert new file page
			res.render('file/file_insert')
	});

	app.post('/file/upload/file', (req,res) => {


		// get file from form
		var file = req.files.upfile;

		// if file exist
		if(!file)
			res.render('fake_news/fake_news_insert', {err:"Choose your file please!"});

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new file
		var FileDAO = new app.app.models.FileDAO(connection, file, path);

		// save pc then db
		FileDAO.save_file((err, result) => {

			// debug
			console.log(err ? err:"Arquivo saved!");

			// get back to the insert view
			res.redirect('/file/insert');
		});
	});

	app.post('/file/edit/file', (req, res) => {

		// get file from form
		var file = req.files.upfile;
		
		// data from form
		var data = req.body;

		// file object
		file_aux = {
			'name':         data['name'] ? data['name']:null,
			'fake_news_id': data['fake_news_id'] ? data['fake_news_id']:null,
			'id':           parseInt(data['id'])
		};

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new file
		var FileDAO = new app.app.models.FileDAO(connection, file_aux, file ? (path + file.name):null);

		if(data['delete'] == ''){

			// deletes file
			FileDAO.delete_file(() => res.redirect('/file/list'));
		}
		else{

			// if have file, upload to pc to later upload on db
			if(file)
				file.mv(path + file.name);
			
			// update file
			FileDAO.update_file((err,resp) => res.redirect('/file/list'));
		}

	});
}