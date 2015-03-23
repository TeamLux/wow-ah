var ItemSchema = require('./item-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	ItemSchema.statics.getorcreateFromApi = function (file, auction, callback) {
		mongoose
			.model('Item')
			.findOne({
				wid: auction.item
			}, function (e, item) {
				if (e) {
					return callback(e);
				}

				if (item) {
					return callback(null, item);
				}

				mongoose
					.model('Item')({
						wid: auction.item
					})
					.save(callback);
			});
	};
})();
