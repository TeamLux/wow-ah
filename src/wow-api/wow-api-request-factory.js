var http = require('http');

module.exports = (function () {
	'use strict';

	function WowApiRequestFactory () {}

	WowApiRequestFactory.prototype.getRequest = function (host, url) {
		var request = http.request({
			method: 'GET',

			host: host,

			headers: {
				'User-Agent': 'Wow-AH <https://github.com/Mickael-van-der-Beek/wow-ah>',
				// 'Accept-Encoding': 'gzip, deflate',
				'Cache-Control': 'no-cache',
				'Accept': 'application/json',
				'Host': host
			},

			agent: false,

			url: url
		});

		request.setTimeout(10000);
		request.setNoDelay(true);

		return request;
	};

	return new WowApiRequestFactory();
});
