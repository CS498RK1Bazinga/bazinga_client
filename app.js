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


/* PassportJS Local Strategy */
/* ============================================ */
var LocalStrategy = require('passport-local').Strategy;
var User = require('./source_js/models/user');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use('local-signup', new LocalStrategy({
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true },

	function(req, email, password, done) {
		User.findOne({'local.email' : email}, function(err, user) {
			if(err)
				return done(err);
			if(user) {
				return done(null, false);
			} else {
				var newUser = new User();
				
				newUser.local.email = email;
				newUser.local.password = newUser.generateHash(password);
				newUser.local.name = req.body.name;
				newUser.local.phoneNumber = req.body.phoneNumber;
				newUser.local.gender = req.body.gender;
				newUser.save(function(err) {
					if(err)
						throw err;
					return done(null, newUser);
				});
			}
			
		});
	}
));

passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'},

	function(email, password, done) {
		User.findOne({'local.email': email}, function(err, user) {
			if(err)
				return done(err);
			if(!user)
				return done(null, false);
			if(!user.validPassword(password))
				return done(null, false);
			return done(null, user);
		});
	}
));

/* ============================================ */

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'passport demo' }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());


/* PassportJS Routes */
/* ============================================ */

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
	res.redirect('./#/users/123');
});

app.post('/login', passport.authenticate('local-login'), function(req, res) {
	res.send(req.user);
});

app.get('/profile', isLoggedIn, function(req, res) {
	res.json({
		user: req.user
	});
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.json({
		error: "User not logged in"
	});
}

/* ============================================ */

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);
