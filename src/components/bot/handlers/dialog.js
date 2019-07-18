const debug = require('debug')('guajirobot:bot:handler:dialog');

module.exports = (controller, botSpeaker) => async msg => {
	const input = msg.text.toString().toLowerCase();
	const user = msg.from;
	const userId = user.id;
	let match;
	debug(`Message received for user ${userId}...`);
	try {
		match = await controller(user).findMatch(input);
	} catch (err) {
		console.error(`Error on message handler: ${err.message}`);
	}
	return match && botSpeaker.reply(msg.chat.id, match);
};
