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
					});
				}.bind(this),
				callback
			);
		}.bind(this));
	};

	WowApi.prototype.createAuctionHouseModels = function (file, content, callback) {
		mongoose
			.model('File')
			.getorcreateFromApi(file, content, callback);
	};

	return new WowApi();
})();
