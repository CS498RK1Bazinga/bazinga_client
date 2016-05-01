module.exports = function(app, passport) {

	app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.redirect('./#/users/123');
	});

	app.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.redirect('./#/users/123');
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

};