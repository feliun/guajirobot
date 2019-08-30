const TelegramBot = require('node-telegram-bot-api');
const { join } = require('path');
const handlerConstructors = require('require-all')({
	dirname: join(__dirname, 'handlers'),
});

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { onlyFirstMatch: true });

	const start = async ({ controller }) => {
		const handlers = Object.keys(handlerConstructors).reduce((total, handlerName) => ({
			...total,
			[handlerName]: handlerConstructors[handlerName](controller, bot),
		}), {});

		console.log('Configuring bot....');
		bot.onText(/\/start/, handlers.start);
		bot.onText(/\/language/, handlers.language);
		bot.onText(/\/trivia/, handlers.trivia);
		bot.on('message', handlers.dialog);
		console.log('Bot up and running!');

		return { processUpdate: bot.processUpdate.bind(bot) };
	};

	return { start };
};
