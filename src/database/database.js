var mongoose = require('mongoose');
var path = require('path');

var colog = require('colog');

module.exports = (function () {
	'use strict';

	function Database () {}

	Database.prototype.init = function (config) {
		colog.success('[\u2714] Database init');

		config = config || {};

		this.db = mongoose.connect(config.uri, config.options);
	};

	Database.prototype.listen = function (callback) {
		colog.success('[\u2714] Database listening');

		this.db.once('connected', callback);
		this.db.once('error', callback);
	};

	Database.prototype.importModels = function (modelsPath) {
		require(path.resolve(__dirname, modelsPath));
	};

	return new Database();
})();
