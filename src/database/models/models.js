var colog = require('colog');

module.exports = (function () {
	'use strict';

	colog.success('[\u2714] Database models:');

	require('./auction/auction');

	require('./file/file');
})();
