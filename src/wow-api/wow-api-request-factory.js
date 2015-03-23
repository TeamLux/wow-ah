var http = require('http');
var url = require('url');

module.exports = (function () {
	'use strict';

	function WowApiRequestFactory () {}

	WowApiRequestFactory.prototype.getRequest = function (host, strUrl, callback) {
		var parsedUrl = url.parse(strUrl);

		var request = http.request({
			method: 'GET',

			hostname: parsedUrl.hostname,
			path: parsedUrl.path,

			headers: {
				// 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
				'User-Agent': 'Wow-AH <https://github.com/Mickael-van-der-Beek/wow-ah>',
				// 'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US',
				'Cache-Control': 'no-cache',
				'Pragma': 'no-cache',
				'Accept': 'application/json',
				'Host': host
			},

			agent: false
		});

		request.setTimeout(10000);
		request.setNoDelay(true);

		request
			.on('response', function (response) {
				response.setEncoding('utf8');

				if (response.statusCode !== 200) {
					return callback(
						new Error('WowApiRequestFactory: APi returned HTTP status code `' + response.statusCode + '`')
					);
				}

				var chunks = [];

				response
					.on('data', function (chunk) {
						chunks.push(chunk);
					})
					.on('end', function (chunk) {
						var data = chunks.join('');

						try {
							data = JSON.parse(data);
						}
						catch (e) {
							return callback(e);
						}

						callback(null, data);
					});
			})
			.on('error', callback);

		request.end();
	};

	return new WowApiRequestFactory();
})();
