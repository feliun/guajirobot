const debug = require('debug')('guajirobot:bot:callbacks:handler:trivia');

module.exports = (controller, bot) => async msg => {
	const composeName = user => {
		if (!user.last_name) return `${user.first_name}`;
		return `${user.first_name} ${user.last_name}`;
	};

	const getChatId = (msg) => msg.message.chat.id;
	const getUser = (msg) => msg.from;

	const offerNextQuestion = async () => {
		const chatId = getChatId(msg);
		const user = getUser(msg);
		await bot.sendMessage(chatId, `Thanks ${composeName(user)}! 📝`, {
			reply_markup: {
				inline_keyboard: [[
					{
						text: '⏭️',
						callback_data: 'command=replay,continue=true',
					},
					{
						text: '⏹️',
						callback_data: 'command=replay,continue=false',
					}
				]],
			},
		});
	};

	const questionId = parseInt(msg.data.q, 10);
	const answer = parseInt(msg.data.a, 10);
	const won = msg.data.win === 'true';
	debug(`Processing answer for question ${questionId}...`);
	const user = getUser(msg);
	await controller(user).registerTriviaAnswer(questionId, answer, won);
	await offerNextQuestion();
	return Promise.resolve();
};
