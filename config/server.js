var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
var app = express();
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(upload());
app.use(express.static(__dirname + '/public'));

consign()
    .include('app/routes')
    .then('config/dbConnection.js')
    .then('app/models')
    .then('app/controllers')
    .into(app);
module.exports = app;

