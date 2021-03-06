var colog = require('colog');
var async = require('async');
var cron = require('cron');

module.exports = (function () {
	'use strict';

	function Server () {
		var NODE_ENV = process.env.NODE_ENV || 'production';

		var databaseConfig = require('./config/database')[NODE_ENV];
		var Database = require('./database/database');

		var wowApiConfig = require('./config/wow-api')[NODE_ENV];
		var WowApi = require('./wow-api/wow-api');

		async.series([
			function database (cb) {
				Database.init(databaseConfig);
				Database.importModels('../database/models/models');
				Database.listen(cb);
			},
			function requester (cb) {
				WowApi.init(wowApiConfig);
				cb(null);
			}
		], function (e) {
			if (e) {
				return colog.error(e) && colog.error(e.stack);
			}

			colog.success(new Array(81).join('-'));

			var job = new (cron.CronJob)(
				'0 */5 * * * *',
				function () {
					WowApi.queryAuctionHouse(function (e) {
						if (e) {
							return colog.error(e) && colog.error(e.stack);
						}
					});
				},
				function () {
					colog.error('Cron: End of cron job');
				}
			);

			job.start();

			// WowApi.queryAuctionHouse(function (e) {
			// 	if (e) {
			// 		return colog.error(e) && colog.error(e.stack);
			// 	}

			// 	colog.success('> Done !');
			// });
		});
	}

	return new Server();
})();
