const debug = require('debug')('guajirobot:bot:commands:handler:language');

module.exports = (controller, bot) => async msg => {
	bot.on('callback_query', async message => {
		console.log(JSON.stringify(message));
		// const language = 'EN';
		// const user = {};
		// await languageCache.updateUser({ ...user, language });
	});
	debug('Processing for language change...');
	await bot.sendMessage(msg.chat.id, 'Elige tu idioma / Please choose your language', {
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
