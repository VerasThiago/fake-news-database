module.exports = (app) => {

	app.get('/file/list', (req,res) => {
		app.app.controllers.file.list(app, req, res);
	});

	app.get('/file/insert_form', (req,res) => {
		app.app.controllers.file.insert_form(app, req, res);
	});

	app.post('/file/upload', (req,res) => {
		app.app.controllers.file.upload(app, req, res);
	});

	app.post('/file/edit', (req, res) => {
		app.app.controllers.file.edit(app, req, res);
	});

	app.post('/file/delete', (req, res) => {
		app.app.controllers.file.delete(app, req, res);
	});
	
}