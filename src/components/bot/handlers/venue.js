module.exports = (controller, bot) => async msg => {
	bot.sendLocation(msg.chat.id, 44.97108, -104.27719);
	bot.sendMessage(msg.chat.id, 'Here is the point');
};
