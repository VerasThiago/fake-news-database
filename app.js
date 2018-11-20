const app = require("./config/server");
const file_functions = require('./app/models/file_functions');

app.listen(3000, (req, res) =>{

	// file path
	var path = __dirname + '/public/uploads/';

	// erase all files before start
	file_functions.erase_files(path);

	console.log("Server ON");
});




