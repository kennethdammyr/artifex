var config		= require('./config.js').config;
var watch 		= require('watch');
var converter	= require('./converter.js');
var fs 			= require('fs');
var moment = require('moment');

var Log 		= require('log');
var log 		= new Log('info', fs.createWriteStream(config.logPath + '/info ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'w'}));
var error 		= new Log('error', fs.createWriteStream(config.logPath + '/error ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'w'}));


log.info('ARTIFEX v1.0');
log.info('by Kenneth Dammyr C 2014');
log.info('Loading program...');


watch.createMonitor(config.monitorPath, function (monitor) {
	log.info('Monitoring ' + config.monitorPath + '...');
	log.info('****************************************');
    monitor.on("created", function (f, stat) {
		if (monitor.files[f] === undefined) {
			converter.convert(f);
		}
    })
})