var ItemSchema = require('./item-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return mongoose.model('Item', ItemSchema);
})();
