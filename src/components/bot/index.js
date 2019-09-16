const TelegramBot = require('node-telegram-bot-api');
const { join } = require('path');
const initAsync = require('../../lib/async');
const handlerConstructors = require('require-all')({
	dirname: join(__dirname, 'handlers'),
});

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { onlyFirstMatch: true });
	const asyncController = initAsync();

	const start = async ({ controller }) => {
		const handlers = Object.keys(handlerConstructors).reduce((total, handlerName) => ({
			...total,
			[handlerName]: handlerConstructors[handlerName](controller, bot),
		}), {});

		const promisify = asyncController.promisify;

		console.log('Configuring bot....');
		bot.onText(/\/start/, promisify(handlers.start));
		bot.onText(/\/language/, promisify(handlers.language));
		bot.onText(/\/trivia/, promisify(handlers.trivia));
		bot.on('message', promisify(handlers.dialog));
		console.log('Bot up and running!');

		const processUpdate = async input => {
			const msgId = input.message.message_id;
			const promise = asyncController.createHangingPromise(msgId);
			bot.processUpdate(input);
			return promise;
		};

		return { processUpdate };
	};

	return { start };
};
