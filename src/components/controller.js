const debug = require('debug')('guajirobot:controller');

module.exports = () => {
	const start = async ({ cms, db }) => userId => {
		const audit = fn => async (...args) => {
			const payload = {
				userId,
				fn: fn.name,
				args: [...args],
				timestamp: Date.now(),
			};
			try {
				await db.audit(payload);
			} catch (e) {
				console.error(`Error auditing ${fn.name} execution`);
			}
			const result = await fn(...args);
			return result;
		};

		const findMatch = async input => {
			debug(`Looking up for input ${input} for user ${userId}...`);
			const language = 'ES';
			return cms.dictionary.lookup(language)(input);
		};

		return {
			findMatch: audit(findMatch),
		};
	};

	return {
		start,
	};
};
