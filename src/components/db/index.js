const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		const updateProfile = async () => {
			await db.collection('users').insertOne({ name: 'Roger' });
			return Promise.resolve();
		};

		return { updateProfile };
	};

	return {
		start,
	};
};
