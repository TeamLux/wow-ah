var http = require('http');

module.exports = (function () {
	'use strict';

	function WowApiUrlFactory () {}

	WowApiUrlFactory.prototype.getUrl = function (host, realm) {
		return 'http://' + host + '/api/wow/auction/data/' + realm;
	};

	return new WowApiUrlFactory();
})();
