var config	= require('./config.js').config;
var probe	= require('node-ffprobe');
var sql		= require('./sql.js');
var sox		= require('sox');
var clean	= require('./clean.js');
var fs = require('fs');
var moment = require('moment');

var Log 		= require('log');
var log 		= new Log('info', fs.createWriteStream(config.logPath + '/info ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));
var error 		= new Log('error', fs.createWriteStream(config.logPath + '/error ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));

// SUPPORT-FUNCTIONS
function getMetadata(file, callback) {	

	probe(file, function(err, probeData) {
			callback(probeData);
	});
	
}

function fillWith(meta, file) {
	if (meta != null) {
		return meta;
	} else {
		return file;
	}
}

// MAIN FUNCTION
function convert(file, categoryID) {
	getMetadata(file, function (probeData) {

			var origFilename = file.split("/").reverse()[0];
			var origFolder = file.split("/").reverse()[1];
			
			var metadata = {
				duration: probeData.format.duration,
				artist: fillWith(probeData.metadata.artist, origFilename),
				title: fillWith(probeData.metadata.title, origFilename),
				album: fillWith(probeData.metadata.album, origFilename),
				year: fillWith(probeData.metadata.date, origFilename),
				path: config.successPath + origFolder + "/" +origFilename.split(".")[0] + "." + config.audio.format,
				category: categoryID
			}
			
			//var newPath = config.successPath + origFolder + origFilename.split(".")[0] + "." + config.audio.format;
			var job = sox.transcode(file, metadata.path, config.audio);					
						
			job.on('end', function() {
				log.info("CONVERTER: " + file + " was done transcoding");
				sql.insert(metadata, function () {
					clean.success(file);
				})
				
			});
			
			job.on('error', function(err) {
				error.error(err);
				log.error('CONVERTER: ' + err.stderr);
				clean.failed(file);
			});
		
			job.start();
			log.info('CONVERTER: Trying to convert: ' + file)
	});
}

exports.convert = convert;