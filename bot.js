const debug = require('debug')('guajirobot:bot');
const TelegramBot = require('node-telegram-bot-api');

module.exports = ({ token }) => {
	const bot = new TelegramBot(token, { polling: true });

	const setupVocabulary = () => {
    debug('Setting up vocabulary...');
		bot.on('message', msg => {
			const Hi = 'hi';
			console.log(msg);
			if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
				bot.sendMessage(msg.chat.id, `Hello ${msg.from.first_name} ${msg.from.last_name}`);
			}
		});
	};

	const setupOnStart = () => {
		bot.onText(/\/start/, msg => {
			bot.sendMessage(msg.chat.id, 'Welcome');
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
		bot.on('callback_query', msg => {
			console.log(JSON.stringify(msg));
		});

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

	const start = async () => {
		console.log('Configuring bot....');
		setupVocabulary();
		setupOnStart();
		setupPictureSending();
		setupVenueQuery();
    setupTrivia();
    console.log('Bot up and running!');
	};

	return { start };
};
