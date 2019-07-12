const debug = require('debug')('guajirobot:db');
const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		const updateProfile = async () => {
			debug('Updating profile...');
			await db.collection('users').insertOne({ name: 'Roger' });
			return Promise.resolve();
		};

		const audit = async payload => {
			debug('Recording a new audited item...');
			await db.collection('audit').insertOne(payload);
		};

		return { updateProfile, audit };
	};

	return {
		start,
	};
};
