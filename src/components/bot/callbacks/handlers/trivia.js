// const debug = require('debug')('guajirobot:bot:callbacks:handler:trivia');

module.exports = (controller, bot) => async msg => {
	const user = msg.from;
	const questionId = parseInt(msg.data.q, 10);
	const answer = parseInt(msg.data.a, 10);
	const won = msg.data.win === 'true';
	const chatId = msg.message.chat.id;

	await controller(user).registerTriviaAnswer(questionId, answer, won);
	await bot.sendMessage(chatId, `Thanks ${user.first_name} ${user.last_name}! 📝`);
	return Promise.resolve();
};
