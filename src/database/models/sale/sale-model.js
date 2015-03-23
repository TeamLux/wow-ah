var FileSchema = require('./file-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return mongoose.model('File', FileSchema);
})();
