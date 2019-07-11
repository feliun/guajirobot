module.exports = {
	bot: {
		token: process.env.BOT_TOKEN || 'bottokengoeshere',
	},
	db: {
		url: process.env.MONGO_URL || 'mongodb://user:pass@localhost:27017/guajirobot',
		db: 'guajirobot',
		options: { useNewUrlParser: true },
	},
	airtable: {
		namespace: 'Content',
		url: 'https://api.airtable.com',
		apiKey: process.env.AIRTABLE_KEY || 'airtablekey',
		base: process.env.AIRTABLE_BASE || 'airtablebase',
	},
};
