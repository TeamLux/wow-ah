var AuctionSchema = require('./auction-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return mongoose.model('Auction', AuctionSchema);
})();
