module.exports = (controller, bot) => async msg => {
	const caption = `
	Welcome to the V&F wedding bot!
	Bienvenido/a al bot de la boda de V&F!
	Choose your language please / Elige tu idioma, por favor:`;
	await bot.sendMessage(msg.chat.id, caption, {
		reply_markup: {
			inline_keyboard: [
				[{
					text: 'English',
					callback_data: 'command=language,language=en',
				}],
				[{
					text: 'Español',
					callback_data: 'command=language,language=es',
				}],
			] },
	});
};
