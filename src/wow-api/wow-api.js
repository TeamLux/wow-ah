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

			try {
				data = JSON.parse(data);
			}
			catch (e) {
				return callback(e);
			}

			this.createFiles(data, callback);
		}.bind(this));
	};

	WowApi.prototype.createFiles = function (response, callback) {
		if (!response || response.files || !response.files.length) {
			return callback(null);
		}

		async.each(
			callback.files,
			this.createFile.bind(this),
			callback
		);
	};

	WowApi.prototype.createFile = function (file, callback) {
		mongoose
			.model('File')({
				url: file.url,
				modified: file.lastModified
			})
			.save(callback);
	};

	WowApi.prototype.requestFile = function (request, callback) {
		var chunks = [];

		request.on('error', callback);

		request.on('data', function (chunk) {
			chunks.push(chunk);
		});

		request.on('end', function (chunk) {
			var data = chunks.join('');

			try {
				data = JSON.parse(data);
			}
			catch (e) {
				return callback(e);
			}

			this.updateFile(data, callback);
		}.bind(this));
	};

	WowApi.prototype.updateFile = function (response, callback) {
		if (!response || response.auctions || !response.auctions.length) {
			return callback(null);
		}

		mongoose
			.model('File')
			.update({
				url: file.url,
			}, {
				dump: response
			})
			.save(callback);
	};

	return new WowApi();
});
