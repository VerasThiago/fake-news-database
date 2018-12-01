// some file functions 
const  file_functions = require('./../models/file_functions');

// file path
const path = __dirname + '/../../public/uploads/';

module.exports.list = (app, req, res) =>{

	// get connection with db
	var connection = app.config.dbConnection();

	// erase all files before upload all
	app.app.models.FileDAO.erase_files(path);

	// get some data from db
	app.app.models.FileDAO.get_all_files( connection, (err,result) => {

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

}

module.exports.insert_form = (app, req, res) =>{

	// get connection with db
	var connection = app.config.dbConnection();

	app.app.models.FileDAO.get_file_data(connection, (err, result) =>{


		if(err){
			res.send(err);
		}
		else{

			var data_list = {
				'all_fake_news': file_functions.string_to_list(result.rows[0].data)
			}
			
			// render insert new file page with all data 
			res.render("file/file_insert_form", { data: data_list });
		}
	});

}

module.exports.upload = (app, req, res) =>{

	// get file from form
	var file = req.files.upfile;

	// data from form
	var data = req.body;

	// if file don't exist
	if(!file)
		return res.redirect('../insert_form/?error=1');

	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new file
	var fileDAO = new app.app.models.FileDAO(connection, null, file.name, null, file.mimetype, data.fake_news, path);

	// save pc then db
	fileDAO.save_file(file, (err,result) =>{

		if(!err)
			res.redirect('/file/insert_form');
		else{
			res.send(err);
		}

	});

}

module.exports.edit = (app, req, res) =>{

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

}