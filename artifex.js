var config		= require('./config.js').config;
var watch 		= require('watch');
var converter	= require('./converter.js');
var sql			= require('./sql.js');
var fs 			= require('fs');
var moment 		= require('moment');
var clean		= require('./clean.js');

var Log 		= require('log');
var log 		= new Log('info', fs.createWriteStream(config.logPath + '/info ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'w'}));
var error 		= new Log('error', fs.createWriteStream(config.logPath + '/error ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'w'}));


log.info('ARTIFEX v1.0');
log.info('by Kenneth Dammyr C 2014');
log.info('Loading program...');

var dir = config.monitorPath;

fs.readdir(dir, function (err, list) {
	// Return the error if something went wrong
	if (err) {
		log.error("ARTIFEX: Could not load directories, see error-log");
		error.error(err);
	}

    // For every file in the list
    list.forEach(function (file) {
	    path = dir + "/" + file;
	    fs.stat(path, function (err, stat) {
		    // If the file is a directory
		    if (stat && stat.isDirectory()){
				log.info("ARTIFEX: Discovered folder: " + file);
				
				sql.getCategoryID(file, function (categoryID) {

					//Do your magic!
					watch.createMonitor(config.monitorPath + file, function (monitor) {
						log.info('ARTIFEX: Monitoring ' + config.monitorPath + file + '...');
					    monitor.on("created", function (f, stat) {
							if (monitor.files[f] === undefined) {
								log.info('ARTIFEX: Found file: ' + f);
								var ftype = f.split(".").reverse()[0];
								if(config.allowedFiles.indexOf(ftype)!=-1) { // Filter out other files
									converter.convert(f, categoryID);
								} else {
									clean.failed(f);
								}

							}
					    })
					})
					
				});
				
		     }
	    });
    });
});

