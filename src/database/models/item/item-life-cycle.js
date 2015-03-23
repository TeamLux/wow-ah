var ItemSchema = require('./item-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	ItemSchema.statics.createFromApi = function (file, auction, callback) {
		this({
			wid: auction.item
		})
		.save(callback);
	};
})();
