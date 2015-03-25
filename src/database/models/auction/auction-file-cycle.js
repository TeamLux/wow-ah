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

				bids: [{
					date: file.modified,
					value: newAuction.bid
				}]
			})
			.save(callback);
	};

	AuctionSchema.statics.updateFromApi = function (file, oldAuction, newAuction, callback) {
		oldAuction.boundaries = {
			end: {
				file: file._id,
				date: file.modified
			}
		};

		var lastBid = oldAuction.bids.slice(-1);

		if (lastBid.value < newAuction.bid) {
			oldAuction.bids.push({
				date: file.modified,
				value: newAuction.bid
			});
		}
		else {
			console.log('OLD=', oldAuction);
			console.log('LAST=', lastBid);
			console.log('TYPE_LAST=', typeof lastBid.value);
			console.log('VAL_LAST=', lastBid.value);
			console.log('TYPE_LAST=', typeof newAuction.bid);
			console.log('VAL_LAST=', newAuction.bid);
			console.log('IS_LARGER=', (lastBid.value < newAuction.bid));
		}

		oldAuction.save(callback);
	};

	// TODO: Diff all auctions that were not present in the present file and set status, buyout
	AuctionSchema.statics.diffFromApi = function (file, callback) {
		callback(null);
	};
})();

