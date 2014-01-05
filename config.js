var config = {
	monitorPath: '/Users/kennethdammyr/Sites/artifex/monitor',
	successPath: 'success/',
	failedPath: 'failed/',
	logPath: 'logs/',
	db: {
		host: "localhost",
		database: "radiodj161",
		user: "root",
		password: ""
	},
	audio: {
		sampleRate: 44100,
		format: 'flac',
		channelCount: 2,
		level: '--norm=-12',
		compressionQuality: 8, 
	}
}

exports.config = config;