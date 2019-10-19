const debug = require('debug')('guajirobot:bot:callbacks:router');

const { join } = require('path');
const handlerConstructors = require('require-all')({
	dirname: join(__dirname, 'handlers'),
});

module.exports = (bot, controller) => {
	const handlers = Object.keys(handlerConstructors).reduce((total, handlerName) => ({
		...total,
		[handlerName]: handlerConstructors[handlerName](controller, bot),
	}), {});

	const parse = data =>
		data.split(',')
			.map(tuple => tuple.split('='))
			.reduce((total, [key, value]) => ({ ...total, [key]: value }), {});

	const route = async msg => {
		const data = parse(msg.callback_query.data);
		const handlerByCommand = {
			trivia: handlers.trivia,
			language: handlers.language,
		};
		debug(`Finding router callback handler for command ${data.command}...`);
		const handler = handlerByCommand[data.command];
		await handler({ ...msg.callback_query, data });
		return Promise.resolve();
	};

	return { route };
};
