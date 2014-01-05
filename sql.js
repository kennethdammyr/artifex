var config	= require('./config.js').config;
var mysql	= require('mysql');
var fs = require('fs');
var moment = require('moment');

var Log 		= require('log');
var log 		= new Log('info', fs.createWriteStream(config.logPath + '/info ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));
var error 		= new Log('error', fs.createWriteStream(config.logPath + '/error ' + moment().format("YYYY-MM-DD") + '.log', {flags: 'a'}));

// MAIN FUNCTION
function insert(metadata, callback) {
	// Prepare SQL-data
	var post  = {
		path: metadata.path, 
		enabled: 1, 
		song_type: 0, 
		id_subcat: 30, 
		weight: 50, 
		duration: metadata.duration, 
		artist: metadata.artist, 
		title: metadata.title, 
		album: metadata.album, 
		year: metadata.year
	};
	
	var connection = mysql.createConnection(config.db);
	
	connection.query('INSERT INTO songs SET ?', post, function(err, result) {
		if(err){
			log.info(err);
		} else {
			log.info("SQL: " + metadata.path + " was inserted into database!");
			callback();	
		}
		
	});
	
	connection.end();
	
}

exports.insert = insert;