module.exports = (controller, bot) => async msg => {
	bot.sendMessage(msg.chat.id, 'Welcome to the V&F wedding bot! Bienvenido/a al bot de la boda de V&F');
};