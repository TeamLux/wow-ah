var FileSchema = require('./file-schema');

var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	FileSchema.pre('save', function (next) {
		if (this.isNew === true) {
			return next(null);
		}

		async.auto({

		}, next);
	});
})();
