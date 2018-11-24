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
					var fileDAO = new app.app.models.FileDAO(connection, file.file_id, file.name, null, file.extension, file.fake_news_id, path);

					// donwload file to server
					fileDAO.download_file();


				}),(res.render("file/file_list", {files:result}));

			}
			else{
				return res.send(err);
			}
			
		});
	});

	app.get('/file/insert', (req,res) => {

		// get connection with db
		var connection = app.config.dbConnection();

		file_functions.get_news_to_insert_file(connection, (err, result) =>{


			if(err)
				return res.send(err);

			// render insert new file page with all data 
			res.render('file/file_insert', {data:result});
			

		});

	});

	app.post('/file/upload/file', (req,res) => {


		// get file from form
		var file = req.files.upfile;

		// if file don't exist
		if(!file)
			return res.redirect('../insert/?error=1');
		
		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new file
		var fileDAO = new app.app.models.FileDAO(connection, null, file.name, null, file.mimetype, req.body.fake_news_id, path);

		console.log("ID = " + fileDAO._fake_news_id);

		// save pc then db
		fileDAO.save_file(file, (err,result) =>{

			if(!err)
				res.redirect('/file/insert');
			else
				res.send(err);

		});
	});

	app.post('/file/edit/file', (req, res) => {

		// get file from form
		var file = req.files.upfile;
		
		// data from form
		var data = req.body;

		// connections with db
		var connection = app.config.dbConnection();

		// instantiating new file
		var fileDAO = new app.app.models.FileDAO(connection, data.id, data.name?data.name:null, null, file?file.mimetype:null, data.fake_news_id ? data.fake_news_id:null, file ? (path + file.name):null);

		if(data['delete'] == ''){

			// deletes file
			fileDAO.delete_file(() => res.redirect('/file/list'));
		}
		else{

			// if have file, upload to pc to later upload on db
			if(file)
				file.mv(path + file.name); 

			// update file
			fileDAO.update_file((err,result) => {
				if(err){
					return res.send(err);
				}
				else
					res.redirect('/file/list')
			});
		}

	});
}