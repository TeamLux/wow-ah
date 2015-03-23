var UserSchema = require('./user-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return mongoose.model('User', UserSchema);
})();
