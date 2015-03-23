var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		username: {
			type: 'String'
		},

		realm: {
			type: 'String'
		}
	});
})();
