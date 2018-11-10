var app = require("./config/server");
pg = require('pg');

var routeIndex = require('./app/routes/home')(app);

const {Client} = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: '<your bd>',
  password: '<your pswd>',
  port: 5432,
});

client.connect(function (err) {
  if(err){
    console.log('Error in connection');
    return;
  }
  console.log('Connection established');
});


client.query('SELECT * FROM ator', (err, res) => {
  console.log(res)
  client.end()
});


app.listen(3000, function(req, res){
	console.log("Server ON");
});