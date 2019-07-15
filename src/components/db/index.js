const debug = require('debug')('guajirobot:db');
const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		db.collection('users').createIndex({ id: 1 }, { unique: true });
		db.collection('audit').createIndex({ fn: 1, timestamp: 1, userId: 1 });
		db.collection('unmatched').createIndex({ language: 1, userId: 1 });

		const updateProfile = async () => {
			debug('Updating profile...');
			await db.collection('users').insertOne({ id: 1, name: 'Roger' });
			return Promise.resolve();
		};

		const audit = async payload => {
			debug('Recording a new audited item...');
			await db.collection('audit').insertOne(payload);
		};

		const storeUnmatched = async payload => {
			debug('Storing unmatched output for given input...');
			await db.collection('unmatched').insertOne(payload);
		};

		return { updateProfile, audit, storeUnmatched };
	};

	return {
		start,
	};
};
