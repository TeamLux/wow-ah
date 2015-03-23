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

			if (!content.auctions || !content.auctions.length) {
				return callback(null);
			}

			colog.success('> Creating ' + auctions.length + ' auctions');

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
