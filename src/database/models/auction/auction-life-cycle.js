var AuctionSchema = require('./auction-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	AuctionSchema.statics.upsertFromApi = function (file, newAuction, callback) {
		this
			.findOne({
				'auction.id': newAuction.auc
			})
			.exec(function (e, oldAuction) {
				if (e) {
					return callback(e);
				}

				if (oldAuction) {
					return this.updateFromApi(file, oldAuction, callback);
				}

				this.createFromApi(file, newAuction, callback);
			}.bind(this));
	};

	AuctionSchema.statics.createFromApi = function (file, newAuction, callback) {
		this({
			startFile: {
				type: file.modified
			},
			endFile: {
				type: file.modified
			},

			state: 'undefined',

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

	AuctionSchema.statics.updateFromApi = function (file, oldAuction, callback) {
		if (file.modified < oldAuction.startFile) {
			oldAuction.startFile = file.modified;
		}

		if (file.modified > oldAuction.endFile) {
			oldAuction.endFile = file.modified;
		}

		oldAuction.save(function (e) {
			callback(e);
		});
	};
})();

