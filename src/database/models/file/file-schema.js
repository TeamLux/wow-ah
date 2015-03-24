var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		url: {
			type: 'String'
		},
		
		modified: {
			type: 'Date'
		},

		// dump: {
		// 	type: 'Mixed'
		// }
	});
})();
