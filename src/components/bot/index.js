const TelegramBot = require('node-telegram-bot-api');
const initAsync = require('../../lib/async');
const initRouter = require('./router');

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { onlyFirstMatch: true });
	const asyncController = initAsync();
	const promisify = asyncController.promisify;

	const start = async ({ controller }) => {
		console.log('Configuring bot....');
		const { route } = initRouter(bot, controller);
		bot.on('message', promisify(route));
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
