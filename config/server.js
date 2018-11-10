var express = require('express'),
	pg = require('pg');
var app = express();
app.set('view engine', 'ejs');
app.set('views', './app/views');

module.exports = app;