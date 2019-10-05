const debug = require('debug')('guajirobot:bot:commands:router');

const { join } = require('path');
const handlerConstructors = require('require-all')({
	dirname: join(__dirname, 'handlers'),
});

module.exports = (bot, controller) => {
	const handlers = Object.keys(handlerConstructors).reduce((total, handlerName) => ({
		...total,
		[handlerName]: handlerConstructors[handlerName](controller, bot),
	}), {});

	const route = async ({ message }) => {
		const { text } = message;
		const handlerByText = {
			'/start': handlers.start,
			'/iniciar': handlers.start,
			'/language': handlers.language,
			'/trivia': handlers.trivia,
			default: handlers.dialog,
		};
		debug(`Finding router handler for text ${text}...`);
		const handler = handlerByText[text] || handlerByText.default;
		await handler(message);
		return Promise.resolve();
	};

	return { route };
};
