var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	configDB = require('./config/database.js'),
	app = express();

mongoose.connect(configDB.url); // db connection
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'passport demo' }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

require('./source_js/routes.js')(app, passport);

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);
