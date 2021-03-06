var AuctionSchema = require('./auction-schema');

var mongoose = require('mongoose');
var async = require('async');

module.exports = (function () {
	'use strict';

	AuctionSchema.statics.upsertFromApi = function (file, newAuction, callback) {
		mongoose
			.model('Auction')
			.findOne({
				'auction.id': newAuction.auc
			})
			.exec(function (e, oldAuction) {
				if (e) {
					return callback(e);
				}

				if (oldAuction) {
					return this.updateFromApi(file, oldAuction, newAuction, callback);
				}

				this.createFromApi(file, newAuction, callback);
			}.bind(this));
	};

	AuctionSchema.statics.createFromApi = function (file, newAuction, callback) {
		mongoose
			.model('Auction')({
				boundaries: {
					start: {
						file: file._id,
						date: file.modified
					}
				},

				auction: {
					id: newAuction.auc
				},

				user: {
					realm: newAuction.ownerRealm,
					id: newAuction.owner
				},

				item: {
					quantity: newAuction.quantity,
					id: newAuction.item
				},

				buyout: {
					date: file.modified,
					value: newAuction.buyout
				},

				bid: {
					date: file.modified,
					value: newAuction.bid
				}
			})
			.save(function (e) {
				callback(e);
			});
	};

	AuctionSchema.statics.updateFromApi = function (file, oldAuction, newAuction, callback) {
		oldAuction.boundaries = {
			end: {
				file: file._id,
				date: file.modified
			}
		};

		oldAuction.save(function (e) {
			callback(e);
		});
	};

	// TODO: Diff all auctions that were not present in the present file and set status, buyout
	AuctionSchema.statics.diffFromApi = function (file, callback) {
		callback(null);
	};
})();

