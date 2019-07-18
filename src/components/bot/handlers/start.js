module.exports = (controller, botSpeaker) => async msg => {
	botSpeaker.reply(msg.chat.id, 'Welcome to the V&F wedding bot! Bienvenido/a al bot de la boda de V&F');
};
