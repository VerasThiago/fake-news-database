

module.exports = (app) => {

	app.get('/fakenews/list', (req,res) => {
		app.app.controllers.fake_news.list(app, req, res);
	});

	app.get('/fakenews/insert_form', (req,res) => {
		app.app.controllers.fake_news.insert_form(app, req, res);
	});

	app.post('/fakenews/upload', (req,res) => {
		app.app.controllers.fake_news.upload(app, req, res);
	});

	app.post('/fakenews/edit', (req,res) => {
		app.app.controllers.fake_news.edit(app, req, res);
	});

	app.post('/fakenews/delete', (req,res) => {
		app.app.controllers.fake_news.delete(app, req, res);
	});
	
}