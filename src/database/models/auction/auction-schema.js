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

		/**
		 * Possible values:
		 * bid = A player bout the item though a winning bid
		 * buyout = A player bought the item in direct buyout
		 * listed = Item that are still on auction
		 * expired = Nobody bought the item
		 */
		status: {
			type: 'String',
			default: 'listed'
		},

		buyout: {
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		},
		bids: [{
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		}],

		dump: {
			type: 'Mixed'
		}
	});
})();
