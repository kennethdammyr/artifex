var config		= require('./config.js').config;
var fs = require('fs');
var moment = require('moment');

var Log 		= require('log');
var log 		= new Log('info', fs.createWriteStream(config.logPath + '/info ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));
var error 		= new Log('error', fs.createWriteStream(config.logPath + '/error ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));


// MAIN FUNCTIONS
function failed(file) {
	
	var newPath = config.failedPath + file.split("/").reverse()[0];
	
	fs.rename(file, newPath, function () {
		log.info("CLEAN: Moved to: "+ newPath);
	});
}

function success(file) {
	fs.unlink(file, function () {
		log.info("CLEAN: Deleted file: " + file);
	});
}

exports.failed = failed;
exports.success = success;