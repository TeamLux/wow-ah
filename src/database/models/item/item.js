var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('\t[\u2714] Item');

	/**
	 * Imports for the Item model.
	 */
	var ItemSchema = require('./item-schema');

	require('./item-model');

	return ItemSchema;
})();
