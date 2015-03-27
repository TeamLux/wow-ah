var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('\t[\u2714] Auction');

	/**
	 * Imports for the Auction model.
	 */
	var AuctionSchema = require('./auction-schema');

	require('./auction-life-cycle');

	require('./auction-model');

	return AuctionSchema;
})();
