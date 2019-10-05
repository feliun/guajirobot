const TelegramBot = require('node-telegram-bot-api');
const initAsync = require('../../lib/async');
const initCommandsRouter = require('./commands/router');
const initCallbacksRouter = require('./callbacks/router');

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { onlyFirstMatch: true });
	const asyncController = initAsync();
	const promisify = asyncController.promisify;

	const extractMsgId = msg => {
		const envelope = msg.message || msg.callback_query.message;
		return envelope.message_id;
	};

	const start = async ({ controller }) => {
		console.log('Configuring bot....');
		const commandRouter = initCommandsRouter(bot, controller);
		const callbackRouter = initCallbacksRouter(bot, controller);
		const routeCommand = promisify(commandRouter.route);
		const routeCallback = promisify(callbackRouter.route);

		const getHandler = msg => {
			const noop = async () => {};
			if (msg.message) return routeCommand;
			if (msg.callback_query) return routeCallback;
			return noop;
		};

		console.log('Bot up and running!');

		const processUpdate = async input => {
			const msgId = extractMsgId(input);
			const promise = asyncController.createHangingPromise(msgId);
			const handler = getHandler(input);
			await handler(input);
			return promise;
		};

		return { processUpdate };
	};

	return { start };
};
