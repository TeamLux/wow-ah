var colog = require('colog');
var async = require('async');
var cron = require('cron');

module.exports = (function () {
	'use strict';

	function Server (callback) {
		var NODE_ENV = process.env.NODE_ENV || 'production';

		var databaseConfig = require('./config/database')[NODE_ENV];
		var Database = require('./database/database');

		var wowApiConfig = require('./config/wow-api')[NODE_ENV];
		var IWowApi = require('./wow-api/i-wow-api');

		async.series([
			function database (cb) {
				Database.init(databaseConfig);
				Database.importModels('../database/models/models');
				Database.listen(cb);
			},
			function requester (cb) {
				IWowApi.init(wowApiConfig);
				cb(null);
			}
		], function (e) {
			if (e) {
				return (callback || colog.error)(e);
			}

			colog.success(new Array(81).join('-'));

			new (cron.CronJob)(
				'*/2 * * * * *',
				function () {
					WowApiClient.requestAuctionHouse(function (e) {
						if (e) {
							return colog.error(e);
						}
					});
				},
				function () {
					colog.error('Cron: End of cron job');
				}
			);
		});
	}

	return new Server();
})();
