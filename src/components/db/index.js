const debug = require('debug')('guajirobot:db');
const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		debug('Configuring db....');
		db.collection('users').createIndex({ id: 1 }, { unique: true });
		db.collection('audit').createIndex({ fn: 1, timestamp: 1, userId: 1 });
		db.collection('unmatched').createIndex({ language: 1, userId: 1 });
		db.collection('trivia').createIndex({ userId: 1 });

		const updateProfile = async profile => {
			debug('Updating profile...');
			const input = {
				id: profile.id,
				username: profile.username,
				isBot: profile.is_bot,
				firstName: profile.first_name,
				lastName: profile.last_name,
				languageCode: profile.language_code,
			};
			const response = await db.collection('users').findOneAndUpdate({ id: input.id }, { $set: input }, { upsert: true, returnNewDocument: true });
			return response;
		};

		const audit = async payload => {
			debug('Recording a new audited item...');
			await db.collection('audit').insertOne(payload);
		};

		const storeUnmatched = async payload => {
			debug('Storing unmatched output for given input...');
			await db.collection('unmatched').insertOne(payload);
		};

		const recordTriviaAnswer = async payload => {
			debug('Storing trivia outcome...');
			await db.collection('trivia').updateOne(
				{ userId: payload.userId, question: payload.question },
				{ $set: payload },
				{ upsert: true },
			);
		};

		return {
			updateProfile,
			audit,
			storeUnmatched,
			recordTriviaAnswer,
		};
	};

	return {
		start,
	};
};
