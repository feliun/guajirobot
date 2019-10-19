const debug = require('debug')('guajirobot:bot:commands:handler:dialog');

module.exports = (controller, bot) => async msg => {
	const noop = () => {};
	const random = list => {
		if (!list) return null;
		return list[Math.floor(Math.random() * list.length)];
	};

	const replyByCategory = {
		Vocabulary: async options => {
			const choice = random(options);
			await bot.sendMessage(msg.chat.id, choice);
		},
		Coordinates: async ({ captions, longitude, latitude }) => {
			await bot.sendLocation(msg.chat.id, latitude, longitude);
			await bot.sendMessage(msg.chat.id, random(captions));
		},
		Pictures: async ({ captions, pictures }) => {
			await bot.sendPhoto(msg.chat.id, random(pictures), { caption: random(captions) });
		},
	};

	const input = msg.text.toString().toLowerCase();
	const user = msg.from;
	const userId = user.id;
	debug(`Message received for user ${userId}...`);
	try {
		const match = await controller(user).findMatch(input);
		if (!match) return Promise.resolve();
		debug(`Match for ${match}...`);
		const { data, category } = match;
		const handler = replyByCategory[category] || noop;
		await handler(data);
	} catch (err) {
		console.error(`Error on message handler: ${err.message}`);
	}
	return Promise.resolve();
};
