var WowApiRequestFactory = require('./wow-api-request-factory');
var WowApiHostFactory = require('./wow-api-host-factory');
var WowApi = require('./wow-api');

var async = require('async');
var colog = require('colog');

module.exports = (function () {
	'use strict';

	function IWowApi () {}

	IWowApi.prototype.init = function (config) {
		config = config || {};

		this.region = config.region;
		this.realm = config.realm;

		WowApi.init(config);
	};

	IWowApi.prototype.requestAuctionHouse = function (callback) {
		if (typeof callback !== 'function') {
			throw 'IWowApi: Argument `callback` is not a function';
		}

		var host = WowApiHostFactory.getHost(this.region);

		if (host === null) {
			return callback(
				new Error('IWowApi: Couldn\'t generate host for region `' + this.region + '`')
			);
		}

		var url = WowApiUrlFactory.getUrl(host, this.realm);

		if (url === null) {
			return callback(
				new Error('IWowApi: Couldn\'t generate URL for host `' + host + '` and realm `' + this.realm + '`')
			);
		}

		var request = WowApiRequestFactory.getRequest(host, url);

		if (request === null) {
			return callback(
				new Error('IWowApi: Couldn\'t generate request for host `' + host + '` and url `' + url + '`')
			);
		}

		IWowApi.requestFiles(request, function (e, files) {
			if (e) {
				return callback(e);
			}

			async.map(
				files,
				IWowApi.requestFile.bind(IWowApi),
				callback
			);
		});
	};

	return new IWowApi();
});
