var AuctionSchema = require('./auction-schema');

var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	AuctionSchema.statics.createFromApi = function (file, auction, callback) {
		async.auto({
			georcreateItem: function (cb) {
				mongoose
					.model('Item')
					.getorcreateFromApi(file, auction, cb);
			},
			getorcreateUser: function (cb) {
				mongoose
					.model('User')
					.getorcreateFromApi(file, auction, cb);
			},
			createAuction: ['georcreateItem', 'getorcreateUser', function (cb, results) {
				var user = results.getorcreateUser;
				var item = results.georcreateItem;

				mongoose
					.model('Auction')({
						file: file._id,
						user: user._id,
						item: item._id,

						quantity: auction.quantity,
						buyout: auction.buyout,
						bid: auction.bid,
						tl: auction.timeLeft
					})
					.save(cb);
			}]
		}, callback);
	};
})();
