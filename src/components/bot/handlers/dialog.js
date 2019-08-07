const debug = require('debug')('guajirobot:bot:handler:dialog');

module.exports = (controller, bot) => async msg => {
	const noop = () => {};
	const random = list => {
		if (!list) return null;
		return list[Math.floor(Math.random() * list.length)];
	};

	const replyByCategory = {
		Vocabulary: options => {
			const choice = random(options);
			bot.sendMessage(msg.chat.id, choice);
		},
		Coordinates: ([coordinates, caption]) => {
			const [latitude, longitude] = coordinates;
			bot.sendLocation(msg.chat.id, latitude, longitude);
			bot.sendMessage(msg.chat.id, caption);
		},
	};

	const input = msg.text.toString().toLowerCase();
	const user = msg.from;
	const userId = user.id;
	debug(`Message received for user ${userId}...`);
	try {
		const match = await controller(user).findMatch(input);
		if (!match) return;
		const { data, category } = match;
		const handler = replyByCategory[category] || noop;
		handler(data);
	} catch (err) {
		console.error(`Error on message handler: ${err.message}`);
	}
};
