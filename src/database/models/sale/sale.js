var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('\t[\u2714] File');

	/**
	 * Imports for the File model.
	 */
	var FileSchema = require('./file-schema');

	require('./file-model');

	return FileSchema;
})();
