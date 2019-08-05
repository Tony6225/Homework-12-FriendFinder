// Dependencies
var express = require('express');
var bodyParser = require('body-parser');

// Initialize app
var app = express();

// PORT is either the port provided by Heroku or 3080
var PORT = process.env.PORT || 3080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(__dirname + '/app/public'));

// Routes
require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);

// Listen
app.listen(PORT, '0.0.0.0');