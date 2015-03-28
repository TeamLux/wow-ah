var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		boundaries: {
			start: {
				file: {
					type: 'ObjectId',
					ref: 'File'
				},
				date: {
					type: 'Date'
				}
			},
			end: {
				file: {
					type: 'ObjectId',
					ref: 'File'
				},
				date: {
					type: 'Date'
				}
			}
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
