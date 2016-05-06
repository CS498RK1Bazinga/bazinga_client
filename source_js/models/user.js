var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		name: {type: String, required: [true, 'A name is required!']},
  		email: {type: String, required: [true, 'An email is required!'], unique: true},
  		password: {type: String, required: [true, 'A password is required!']},
  		phoneNumber: {type: String, required: [true, 'A phone number is required!']},
  		gender: {type: String},
  		image: {type: String, default: 'https://bucketlist.org/static/images/generic-profile-pic.png'},
    	attending: {type: [String], default: []},
    	hosting: {type: [String], default: []},
    	history: {type: [String], default: []},
    	following: {type: [String], default: []}
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);