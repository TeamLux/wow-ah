var colog = require('colog');
var async = require('async');

module.exports = (function () {
	'use strict';

	function Server () {
		var NODE_ENV = process.env.NODE_ENV || 'production';

		var databaseConfig = require('./config/database')[NODE_ENV];
		var Database = require('./database/database');

		var FileSync = require('./file-sync/file-sync');

		async.series([
			function database (cb) {
				Database.init(databaseConfig);
				Database.importModels('../database/models/models');
				Database.listen(cb);
			}
		], function (e) {
			if (e) {
				return colog.error(e) && colog.error(e.stack);
			}

			colog.success(new Array(81).join('-'));

			FileSync.sync(
				'/Users/kollektiv/Documents/wow-ah/03-04-2015/data',
				function (e) {
					if (e) {
						colog.error(e);
					}
					else {
						colog.success('Done!');
					}

					process.exit(1);
				}
			);
		});
	}

	return new Server();
})();
