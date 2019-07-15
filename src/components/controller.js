const debug = require('debug')('guajirobot:controller');

module.exports = () => {
	const start = async ({ cms, db }) => user => {
		const audit = fn => async (...args) => {
			const payload = {
				userId: user.id,
				fn: fn.name,
				args: [...args],
				timestamp: new Date(),
			};
			try {
				await Promise.all([db.audit(payload), db.updateProfile(user)]);
			} catch (e) {
				console.error(`Error auditing ${fn.name} execution: ${e.message}`);
			}
			const result = await fn(...args);
			return result;
		};

		const findMatch = async input => {
			debug(`Looking up for input ${input} for user ${user.id}...`);
			const language = 'ES';
			const result = cms.dictionary.lookup(language)(input);
			if (result) return result;
			try {
				await db.storeUnmatched({ language, input, userId: user.id, timestamp: new Date() });
				return cms.dictionary.lookup(language)('fallback');
			} catch (e) {
				console.error(`Error storing unmatched input ${input}`);
			}
			return null;
		};

		return {
			findMatch: audit(findMatch),
		};
	};

	return {
		start,
	};
};
