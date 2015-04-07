var eventStream = require('event-stream');
var mongoose = require('mongoose');
var colog = require('colog');
var async = require('async');
var path = require('path');
var fs = require('fs');

module.exports = (function () {
	'use strict';

	function FileSync () {}

	FileSync.prototype.sync = function (dirname, callback) {
		if (typeof dirname !== 'string') {
			return callback(
				new Error('FileSync: Invalid directory name `' + dirname + '`')
			);
		}

		var absDirname = path.resolve(__dirname, dirname);

		fs.readdir(
			absDirname,
			function (e, filenames) {
				if (e) {
					return callback(e);
				}

				if (!Array.isArray(filenames) || !filenames.length) {
					return callback(
						new Error('FileSync: No files were found in directory `' + absDirname + '`')
					);
				}

				filenames = filenames.map(function (filename) {
					return path.resolve(absDirname, filename);
				});

				this.syncFiles(filenames, callback);
			}.bind(this)
		);
	};

	FileSync.prototype.syncFiles = function (filenames, callback) {
		var length = filenames.length;
		var counter = 0;

		async.eachSeries(
			filenames,
			function (filename, cb) {
				counter += 1;

				colog.success('Processing file ' + counter + '/' + length + '(' + (counter / (length / 100)) + '%)');

				this.syncFile(filename, cb);
			}.bind(this),
			callback
		);
	};

	FileSync.prototype.syncFile = function (pathname, callback) {
		var filename = pathname.split('/').pop();

		if (!/^([0-9a-f]{32}-[0-9]{13}\.json)$/.test(filename)) {
			return callback(
				new Error('FileSync: Invalid filename `' + filename + '`')
			);
		}

		fs
			.createReadStream(
				pathname,
				{
					encoding: 'utf8',
					flags: 'r'
				}
			)
			.pipe(
				eventStream.wait(function (e, body) {
					if (e) {
						return callback(e);
					}

					try {
						body = JSON.parse(body);
					}
					catch (e) {
						return callback(e);
					}

					filename = filename.split('-');

					var file = {
						url: 'http://eu.battle.net/auction-data/' + filename[0] + '/auctions.json',
						modified: new Date(
							parseInt(
								filename[1].slice(0, -5),
								10
							)
						)
					};

					this.syncAuctions(file, body, callback);
				}.bind(this))
			);
	};

	FileSync.prototype.syncAuctions = function (file, body, callback) {
		if (!body || !body.auctions || !body.auctions.auctions) {
			return callback(
				new Error('FileSync: No auctions in file `' + file.url + '`')
			);
		}

		var length = body.auctions.auctions.length;
		var counter = 0;

		async.eachLimit(
			body.auctions.auctions,
			25,
			function (auction, cb) {
				counter += 1;

				if ((counter % 2000) === 0) {
					colog.success('Processing auction ' + counter + '/' + length + '(' + (counter / (length / 100)) + '%)');
				}

				mongoose
					.model('Auction')
					.upsertFromApi(file, auction, cb);
			},
			callback
		);
	};

	return new FileSync();
})();
