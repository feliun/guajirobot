module.exports = {
	bot: {
		token: process.env.BOT_TOKEN || 'bottokengoeshere',
	},
	server: {
		port: process.env.PORT || 3000,
	},
	db: {
		url: process.env.MONGO_URL || 'mongodb://user:pass@localhost:27017/guajirobot',
		db: process.env.MONGO_DB || 'guajirobot',
		options: { useNewUrlParser: true },
	},
	s3: {
		bucket: process.env.S3_BUCKET,
	},
	airtable: {
		apiKey: process.env.AIRTABLE_KEY || 'airtablekey',
		base: process.env.AIRTABLE_BASE || 'airtablebase',
		url: 'https://api.airtable.com',
		namespaces: {
			dictionary: 'Dictionary',
			trivia: 'Trivia',
		},
	},
};
