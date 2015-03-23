var http = require('http');

module.exports = (function () {
	'use strict';

	function WowApiRequestFactory () {}

	WowApiRequestFactory.prototype.getRequest = function (host, url, callback) {
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

		request.setEncoding('utf8');
		request.setTimeout(10000);
		request.setNoDelay(true);

		var chunks = [];

		request
			.on('response', function (response) {
				if (response.statusCode !== 200) {
					callback(
						new Error('WowApiRequestFactory: APi returned HTTP status code `' + response.statusCode + '`')
					);
				}
			})
			.on('error', callback)
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

				this.updateFile(data, callback);
			}.bind(this));

		request.end();
	};

	return new WowApiRequestFactory();
});
