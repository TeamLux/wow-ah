var FileSchema = require('./file-schema');

var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	FileSchema.statics.getorcreateFromApi = function (newFile, content, callback) {
		mongoose
			.model('File')
			.findOne({
				url: newFile.url
			})
			.exec(function (e, oldFile) {
				if (e) {
					return callback(e);
				}

				if (oldFile) {
					return callback(null, oldFile);
				}

				this.createFromApi(newFile, content, callback);
			}.bind(this));
	};

	FileSchema.statics.createFromApi = function (newFile, content, callback) {
		mongoose
			.model('File')({
				url: newFile.url,

				modified: new Date(newFile.lastModified)
			})
			.save(callback);
	};
})();
