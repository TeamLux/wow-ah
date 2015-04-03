var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		startFile: {
			type: 'Date'
		},
		startEst: {
			type: 'Date'
		},
		endFile: {
			type: 'Date'
		},
		endEst: {
			type: 'Date'
		},

		state: {
			type: 'String'
		},

		auction: {
			id: {
				type: 'String'
			}
		},

		user: {
			realm: {
				type: 'String'
			},
			id: {
				type: 'String'
			}
		},

		item: {
			quantity: {
				type: 'Number'
			},
			id: {
				type: 'String'
			}
		},

		buyout: {
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		},
		bid: {
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		}
	});
})();
