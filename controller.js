const debug = require('debug')('guajirobot:controller');

module.exports = () => {
	const start = async ({ cms }) => {
		const findMatch = async (userId, input) => {
			debug(`Looking up for input ${input} for user ${userId}...`);
			const language = 'ES';
			return cms.dictionary.lookup(language)(input);
		};

		return {
			findMatch,
		};
	};

	return {
		start,
	};
};
