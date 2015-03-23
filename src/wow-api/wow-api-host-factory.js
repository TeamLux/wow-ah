module.exports = (function () {
	'use strict';

	function WowApiHostFactory () {}

	WowApiHostFactory.prototype.getHost = function (region) {
		region = region.toLowerCase();

		var host = null;

		switch (region) {
			case 'europe':
				host = 'eu.battle.net';
				break;
			case 'taiwan':
				host = 'tw.battle.net';
				break;
			case 'korea':
				host = 'kr.battle.net';
				break;
			case 'china':
				host = 'www.battlenet.com.cn';
				break;
			case 'us':
				host = 'us.battle.net';
				break;
		}

		return host;
	};

	return new WowApiHostFactory();
});
