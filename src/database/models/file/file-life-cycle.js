var FileSchema = require('./file-schema');

var mongoose = require('mongoose');
var async = require('async');
var colog = require('colog');

module.exports = (function () {
	'use strict';

	FileSchema.statics.getorcreateFromApi = function (file, content, callback) {
		mongoose
			.model('File')
			.findOne({
				url: file.url
			}, function (e, oldfile) {
				if (e) {
					return callback(e);
				}

				if (oldfile) {
					return callback(null, oldfile);
				}

				mongoose
					.model('File')({
						modified: file.modified,
						url: file.url,
						dump: content
					})
					.save(function (e, file) {
						if (e) {
							return callback(e);
						}

						if (!content.auctions || !content.auctions.auctions || !content.auctions.auctions.length) {
							return callback(null);
						}

						colog.success('> Creating ' + content.auctions.auctions.length + ' auctions');

						var counter = 0;
						var total = content.auctions.auctions.length;

						async.eachSeries(
							content.auctions.auctions,
							function (auction, cb) {
								counter += 1;

								if ((counter % 1000) === 0) {
									colog.success('> Created ' + counter + '/' + total + ' (' + (counter / (total / 100)) + '%)');
								}

								mongoose
									.model('Auction')
									.createFromApi(file, auction, cb);
							},
							callback
						);
					});
			});
	};
})();
