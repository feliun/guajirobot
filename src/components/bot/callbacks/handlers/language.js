const debug = require('debug')('guajirobot:bot:callbacks:handler:language');

module.exports = (controller, bot) => async msg => {
	const composeName = user => {
		if (!user.last_name) return `${user.first_name}`;
		return `${user.first_name} ${user.last_name}`;
	};

	const greeting = (language, userName) => {
		const textDictionary = {
			en: `Thanks for the info, ${userName}. Noted! 🇬🇧`,
			es: `Muchas gracias, ${userName}. Apuntado! 🇪🇸`,
		};
		return textDictionary[language];
	};

	const user = msg.from;
	const preferredLanguage = msg.data.language;
	const chatId = msg.message.chat.id;
	try {
		debug(`Updating language preference for user ${user.id}...`);
		await controller(user).updateLanguage(preferredLanguage);
		await bot.sendMessage(chatId, greeting(preferredLanguage, composeName(user)));
	} catch (e) {
		console.error(e);
		await bot.sendMessage(chatId, 'There was an error. Blame Felipe!');
	}
	return Promise.resolve();
};
