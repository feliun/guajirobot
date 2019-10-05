const debug = require('debug')('guajirobot:bot:commands:handler:trivia');

module.exports = (controller, bot) => async msg => {
	const format = answers => answers.map((answer, index) => {
		const response = {
			command: 'trivia',
			data: {
				question: 1, // TODO use an immutable Q ID
				answer: index,
			},
		};
		return {
			text: answer.text,
			callback_data: JSON.stringify(response),
		};
	});

	const user = msg.from;
	debug(`Finding a trivia question for user ${user.id}...`);
	const question = await controller(user).getTriviaQuestion(msg.from.id);
	await bot.sendMessage(msg.chat.id, question.text, {
		reply_markup: {
			inline_keyboard: [format(question.answers)],
		},
	});
	return Promise.resolve();
};
