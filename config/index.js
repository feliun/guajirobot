module.exports = {
	bot: {
		token: process.env.BOT_TOKEN || 'bottokengoeshere',
	},
	db: {
		url: process.env.MONGO_URL || 'mongodb://user:pass@localhost:27017/guajirobot',
		db: process.env.MONGO_DB || 'guajirobot',
		options: { useNewUrlParser: true },
	},
	airtable: {
		apiKey: process.env.AIRTABLE_KEY || 'airtablekey',
		base: process.env.AIRTABLE_BASE || 'airtablebase',
		url: 'https://api.airtable.com',
		namespaces: {
			dictionary: 'Content',
		},
	},
};
