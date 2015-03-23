var UserSchema = require('./user-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	UserSchema.statics.getorcreateFromApi = function (file, auction, callback) {
		mongoose
			.model('User')
			.findOne({
				username: auction.owner
			}, function (e, user) {
				if (e) {
					return callback(e);
				}

				if (user) {
					return callback(null, user);
				}

				mongoose
					.model('User')({
						username: auction.owner,

						realm: auction.ownerRealm
					})
					.save(callback);
			});
	};
})();
