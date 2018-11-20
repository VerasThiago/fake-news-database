var app = require("./config/server");

app.listen(3000, (req, res) =>{

	// file path
	var path = __dirname + '/public/uploads/';

	// erase all files before start
	var file_functions = require('./app/models/file_functions');

	// erase all files before start
	file_functions.erase_files(path);

	console.log("Server ON");
});




