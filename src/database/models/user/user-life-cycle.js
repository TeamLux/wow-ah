var UserSchema = require('./user-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	UserSchema.statics.createFromApi = function (file, auction, callback) {
		this({
			username: auction.owner,

			realm: auction.ownerRealm
		})
		.save(callback);
	};
})();
