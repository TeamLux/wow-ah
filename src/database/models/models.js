var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('[\u2714] Database models:');

	require('./user/user');

	require('./file/file');

	require('./sale/sale');

	require('./item/item');
})();
