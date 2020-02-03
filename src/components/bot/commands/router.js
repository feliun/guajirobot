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

	const containsPhoto = input => !!input.photo;

	const route = async ({ message }) => {
		const handlerByInput = {
			'/start': handlers.language,
			'/iniciar': handlers.language,
			'/language': handlers.language,
			'/trivia': handlers.trivia,
			default: handlers.dialog,
		};
		const handler = containsPhoto(message) ? handlers.picture : handlerByInput[message.text] || handlerByInput.default;
		await handler(message);
		return Promise.resolve();
	};

	return { route };
};
