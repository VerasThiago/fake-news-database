var app = require("./config/server");

app.listen(3000, (req, res) =>{

	// get file functions
	var fileModel = app.app.models.fileModel;

	// file path
	var path = 'public/uploads/*'
	
	// erase all files before start
	fileModel.erase_file(path);

	console.log("Server ON");
});




