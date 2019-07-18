const debug = require('debug')('guajirobot:bot');
const TelegramBot = require('node-telegram-bot-api');
const { join } = require('path');
const handlerConstructors = require('require-all')({
	dirname: join(__dirname, 'handlers'),
});

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { polling: true });

	// const defaultLanguage = 'ES';

	const start = async ({ controller }) => {
		const botSpeaker = { reply: bot.sendMessage.bind(bot), sendPhoto: bot.sendPhoto.bind(bot) };
		const handlers = Object.keys(handlerConstructors).reduce((total, handlerName) => ({
			...total,
			[handlerName]: handlerConstructors[handlerName](controller, botSpeaker),
		}), {});

		const languageQuery = chatId => {
			bot.on('callback_query', async msg => {
				console.log(JSON.stringify(msg));
				// const language = 'EN';
				// const user = {};
				// await languageCache.updateUser({ ...user, language });
			});

			bot.sendMessage(chatId, 'Elige tu idioma / Please choose your language', {
				reply_markup: {
					inline_keyboard: [
						[{
							text: 'Español',
							callback_data: 'language:ES',
						}],
						[{
							text: 'English',
							callback_data: 'language:EN',
						}],
					],
				},
			});
		};

		const setupLanguage = () => {
			bot.onText(/\/language/, msg => {
				languageQuery(msg.chat.id);
			});
		};

		const setupOnStart = () => {
			bot.onText(/\/start/, msg => {
				console.log(JSON.stringify(msg));
				// bot.sendMessage(msg.chat.id, 'Welcome to the V&F wedding bot! Bienvenido/a al bot de la boda de V&F');
				// languageQuery(msg.chat.id);
			});
		};

		const setupPictureSending = () => {
			bot.onText(/\/sendpic/, msg => {
				bot.sendPhoto(msg.chat.id, 'https://cdn0.bodas.net/usuarios/fotos/9/6/0/9/mfb_3469069.jpg?lu=1551276274', { caption: 'Besitos de la pareja! \nEstamos deseando verte' });
			});
		};

		const setupVenueQuery = () => {
			bot.onText(/\/venue/, msg => {
				bot.sendLocation(msg.chat.id, 44.97108, -104.27719);
				bot.sendMessage(msg.chat.id, 'Here is the point');
			});
		};

		const setupTrivia = () => {
			// bot.on('callback_query', msg => {
			//   console.log(JSON.stringify(msg));
			// });

			const questions = [
				{
					id: 1,
					question: 'When did we kiss for the first time?',
					answers: [
						{
							text: 'London',
							hit: false,
						},
						{
							text: 'Madrid',
							hit: false,
						},
						{
							text: 'In the middle of a flight',
							hit: true,
						},
					],
				},
			];

			bot.onText(/\/trivia/, msg => {
				bot.sendMessage(msg.chat.id, questions[0].question, {
					reply_markup: {
						inline_keyboard: [
							[{
								text: questions[0].answers[0].text,
								callback_data: 'question:1,answer:0',
							}, {
								text: questions[0].answers[1].text,
								callback_data: 'question:1,answer:1',
							}, {
								text: questions[0].answers[2].text,
								callback_data: 'question:1,answer:2',
							},
							]],
					},
				});
			});
		};

		console.log('Configuring bot....');
		debug('Setting up vocabulary...');
		bot.on('message', handlers.dialog);
		setupOnStart();
		setupLanguage();
		setupPictureSending();
		setupVenueQuery();
		setupTrivia();
		console.log('Bot up and running!');
	};

	return { start };
};
