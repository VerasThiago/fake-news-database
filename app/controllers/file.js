// some file functions 
const  file_functions = require('./../models/file_functions');

// file path
const path = __dirname + '/../../public/uploads/';

module.exports.list = (app, req, res) =>{

	/**
	 *
	 *  This method render a view passing object with all news in database and all data related with fake news to user update it if necessary
	 *
	 */


	// get connection with db
	var connection = app.config.dbConnection();

	// erase all files before upload all
	app.app.models.FileDAO.erase_files(path);

	// get some data from db
	app.app.models.FileDAO.get_all_files( connection, (err,result) => {

		/**
		 *
		 *  get_all_files method returns all files and inside this callback is converted to object of file class and pushed to a list of objects
		 *
		 */

		// list of files object
		var files = new Array;

		// files returned from database
		var data = result.rows;

		// walking through all files
		for(var i = 0; i < data.length; i++){

			var fileDAO = new app.app.models.FileDAO(connection, data[i].file_id, data[i].name, null,
													 data[i].extension, data[i].fake_news_id,
													 data[i].fake_news_title,  path);

			fileDAO.download_file();

			files.push(fileDAO);

		};

		app.app.models.FileDAO.get_file_data(connection, (err, result) =>{

			/**
			 *
			 *  get_file_data returns list of all fake news so user can update his file based on this data
			 *
			 */

			var data_list = {
				'files' : files,
				'all_fake_news': file_functions.string_to_list(result.rows[0].data)
			}
			
			// render file list page with all data 
			res.render("file/file_list", { data: data_list });
		});
	});
}

module.exports.insert_form = (app, req, res) =>{

	/**
	 *
	 *  This method render a view passing object with all data related with file to user insert his own file
	 *	
	 */

	var connection = app.config.dbConnection();

	app.app.models.FileDAO.get_file_data(connection, (err, result) =>{

		/**
		 *
		 *  get_file_data returns list of all fake news so user can choose with fake news this files belongs
		 *
		 */

		var data_list = {
			'all_fake_news': file_functions.string_to_list(result.rows[0].data)
		}
		
		// render insert new file page with all data 
		res.render("file/file_insert_form", { data: data_list });
	
	});

}

module.exports.upload = (app, req, res) =>{

	/**
	 *
	 *  This method upload file recieved from user form to server, then insert in database and redirecting to the same page
	 *
	 *	Checks if if exist file, then uploads to server then to database
     *
     *
	 */


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
	var fileDAO = new app.app.models.FileDAO(connection, null, file.name, null, file.mimetype, data.fake_news, null, path);

	// save pc then db
	fileDAO.save_file(file, (err,result) =>	res.redirect('/file/insert_form'));

}

module.exports.edit = (app, req, res) =>{

	/**
	 *
	 *  This method upload data recieved from user form, upload to server (if necessary) and insert in database, redirecting to the same page, but this time the form is a edit form and insert in an existing file in database
	 *
	 *	Create object of file, then check if delete button was checked to delete or update file
     *
	 */

	// get file from form
	var file = req.files.upfile;
	
	// data from form
	var data = req.body;

	// connections with db
	var connection = app.config.dbConnection();

	// instantiating new file
	var fileDAO = new app.app.models.FileDAO(connection, data.id, data.name?data.name:null, null, file?file.mimetype:null, data.fake_news_id ? data.fake_news_id:null, null, file ? (path + file.name):null);

	if(data.delete == ''){
		fileDAO.delete_file(() => res.redirect('/file/list'));
	}
	else{

		// if have file, upload to pc to later upload on db
		if(file)
			file.mv(path + file.name); 

		// update file
		fileDAO.update_file((err,result) =>	res.redirect('/file/list'));
	}

}