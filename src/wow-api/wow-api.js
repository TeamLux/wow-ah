var WowApiRequestFactory = require('./wow-api-request-factory');
var WowApiHostFactory = require('./wow-api-host-factory');
var WowApiUrlFactory = require('./wow-api-url-factory');

var mongoose = require('mongoose');
var async = require('async');
var colog = require('colog');

module.exports = (function () {
	'use strict';

	function WowApi () {}

	WowApi.prototype.init = function (config) {
		config = config || {};

		this.region = config.region;
		this.realm = config.realm;
	};

	WowApi.prototype.queryAuctionHouse = function (callback) {
		if (typeof callback !== 'function') {
			throw 'WowApi: Argument `callback` is not a function';
		}

		var host = WowApiHostFactory.getHost(this.region);

		if (host === null) {
			return callback(
				new Error('WowApi: Couldn\'t generate host for region `' + this.region + '`')
			);
		}

		var url = WowApiUrlFactory.getUrl(host, this.realm);

		if (url === null) {
			return callback(
				new Error('WowApi: Couldn\'t generate URL for host `' + host + '` and realm `' + this.realm + '`')
			);
		}

		WowApiRequestFactory.getRequest(host, url, function (e, files) {
			if (e) {
				return callback(e);
			}

			if (!files || !files.files || !files.files.length) {
				return callback(
					new Error('WowApi: No files found')
				);
			}

			colog.success('> Creating ' + files.files.length + ' auction files');

			async.eachSeries(
				files.files,
				function (file, cb) {
					WowApiRequestFactory.getRequest(host, file.url, function (e, content) {
						if (e) {
							return cb(e);
						}

						this.createAuctionHouseModels(file, content, cb);
					}.bind(this));
				}.bind(this),
				callback
			);
		}.bind(this));
	};

	WowApi.prototype.createAuctionHouseModels = function (rawFile, content, callback) {
		mongoose
			.model('File')
			.getorcreateFromApi(rawFile, content, function (e, file, isNew) {
				if (e) {
					return callback(e);
				}

				if (isNew === false) {
					colog.success('> Skipping duplicate ' + file.url + ' from ' + rawFile.lastModified);

					return callback(null);
				}

				if (!content.auctions || !content.auctions.auctions || !content.auctions.auctions.length) {
					return callback(null);
				}

				colog.success('> Creating ' + content.auctions.auctions.length + ' auctions');

				var counter = 0;
				var total = content.auctions.auctions.length;

				async.eachLimit(
					content.auctions.auctions,
					20,
					function (auction, cb) {
						counter += 1;

						if ((counter % 1000) === 0) {
							colog.success('> Created ' + counter + '/' + total + ' (' + (counter / (total / 100)) + '%)');
						}

						mongoose
							.model('Auction')
							.upsertFromApi(file, auction, cb);
					},
					function (e) {
						if (e) {
							return callback(e);
						}

						// Nulling variables to clear memory
						content = null;

						mongoose
							.model('Auction')
							.diffFromApi(file, callback);
					}
				);
			});
	};

	return new WowApi();
})();
