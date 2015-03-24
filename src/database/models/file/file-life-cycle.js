var FileSchema = require('./file-schema');

var mongoose = require('mongoose');
var async = require('async');
var colog = require('colog');

module.exports = (function () {
	'use strict';

	FileSchema.statics.upsertFromApi = function (newFile, content, callback) {
		mongoose
			.model('File')
			.findOne({
				url: file.url
			})
			.exec(function (e, oldFile) {
				if (e) {
					return callback(e);
				}

				if (oldFile) {
					return this.updateFromApi(oldFile, newFile, content, callback);
				}

				this.createFromApi(newFile, content, callback);
			}.bind(this));
	};

	FileSchema.statics.createFromApi = function (newFile, content, callback) {
		mongoose
			.model('File')({
				url: newFile.url,

				modified: new Date(newFile.lastModified),

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
	};
})();
