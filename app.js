const app = require("./config/server");

app.listen(3000, (req, res) =>{

	// file path
	var path = __dirname + '/public/uploads/';

	// erase all files before upload all
	app.app.models.FileDAO.erase_files(path);

	console.log("Server ON");
});




