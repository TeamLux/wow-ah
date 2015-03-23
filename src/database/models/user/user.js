var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('\t[\u2714] User');

	/**
	 * Imports for the User model.
	 */
	var UserSchema = require('./user-schema');

	require('./user-life-cycle');

	require('./user-model');

	return UserSchema;
})();
