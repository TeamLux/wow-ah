var FileSchema = require('./file-schema');

var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	FileSchema.statics.createFromApi = function (file, content, callback) {
		this({
			modified: file.modified,
			url: file.url,
			dump: content
		})
		.save(function (e, file) {
			if (e) {
				return callback(e);
			}

			if (content.auctions) {
				return callback(null);
			}

			async.eachSeries(
				content.auctions,
				function (auction, cb) {
					mongoose
						.model('Auction')
						.createFromApi(file, auction, cb);
				},
				callback
			);
		});
	};
})();
