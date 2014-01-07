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
		year: metadata.year,
		id_subcat: metadata.category
	};
	
	var connection = mysql.createConnection(config.db);
	
	connection.query('INSERT INTO songs SET ?', post, function(err, result) {
		if(err){
			log.info("SQL: " + err);
		} else {
			log.info("SQL: " + metadata.path + " was inserted into database with category "+metadata.category+"!");
			callback();	
		}
		
	});
	
	connection.end();
	
}

function getCategoryID(foldername, callback) {
	var connection = mysql.createConnection(config.db);
	
	connection.connect(function(err) {
		if (err) {
			log.error("SQL: Can't connect to MySQL-database.");
		}
	});
	
	connection.query("SELECT ID FROM subcategory WHERE name=\'"+foldername+"\'", function(err, result) {
		if(err){
			error.error(err);
		} else {
			if (result[0] != null) {
				callback(result[0].ID);	
				log.info("SQL: Foldername " + foldername + " equals to subcategoryID "+ result[0].ID);
			} else {
				callback(0);	
				error.error("SQL: Couldn't find subcategoryID for foldername " + foldername);
			}
			
		}
		
	});
	
	connection.end();
}

exports.insert = insert;
exports.getCategoryID = getCategoryID;