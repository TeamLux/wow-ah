var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		file: {
			type: 'ObjectId',
			ref: 'File'
		},
		user: {
			type: 'ObjectId',
			ref: 'User'
		},
		item: {
			type: 'ObjectId',
			ref: 'Item'
		},
		
		quantity: {
			type: 'Number'
		},
		buyout: {
			type: 'Number'
		},
		bid: {
			type: 'Number'
		},
		tl: {
			type: 'String'
		}
	});
})();
