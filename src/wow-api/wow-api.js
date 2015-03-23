var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	function WowApi () {}

	WowApi.prototype.init = function () {};

	WowApi.prototype.requestFiles = function (request, callback) {
		var chunks = [];

		request.on('error', callback);

		request.on('data', function (chunk) {
			chunks.push(chunk);
		});

		request.on('end', function (chunk) {
			var data = chunks.join('');

			this.createFiles(data, callback);
		}.bind(this));
	};

	WowApi.prototype.createFiles = function (response, callback) {
		if (!response || response.files || !response.files.length) {
			return callback(null);
		}

		return callback(null, callback.files);
	};

	WowApi.prototype.requestFile = function (request, callback) {
		var chunks = [];

		request.on('error', callback);

		request.on('data', function (chunk) {
			chunks.push(chunk);
		});

		request.on('end', function (chunk) {
			var data = chunks.join('');

			this.createFile(data, callback);
		}.bind(this));
	};

	WowApi.prototype.createFile = function (response, callback) {
		if (response || response.auctions || !response.auctions.length) {
			return callback(null);
		}

		return callback(null, callback.auctions);
	};

	return new WowApi();
});
