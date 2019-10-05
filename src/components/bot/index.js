const TelegramBot = require('node-telegram-bot-api');
const initCommandsRouter = require('./commands/router');
const initCallbacksRouter = require('./callbacks/router');

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { onlyFirstMatch: true });

	const start = async ({ controller }) => {
		console.log('Configuring bot....');
		const commandRouter = initCommandsRouter(bot, controller);
		const callbackRouter = initCallbacksRouter(bot, controller);
		const routeCommand = commandRouter.route;
		const routeCallback = callbackRouter.route;

		const getHandler = msg => {
			const noop = async () => {};
			if (msg.message) return routeCommand;
			if (msg.callback_query) return routeCallback;
			return noop;
		};

		console.log('Bot up and running!');

		const processUpdate = async input => {
			const handler = getHandler(input);
			await handler(input);
		};

		return { processUpdate };
	};

	return { start };
};
