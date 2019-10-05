const debug = require('debug')('guajirobot:bot:commands:handler:trivia');

module.exports = (controller, bot) => async msg => {
	const format = winner => answers => answers.map((answer, index) => {
		const question = 1; // TODO use an immutable real Q ID
		// https://github.com/nickoala/telepot/issues/293#issuecomment-326426090
		const response = `command=trivia,q=${question},a=${index + 1},win=${winner === (index + 1)}`;
		return {
			text: answer.text,
			callback_data: response,
		};
	});

	const user = msg.from;
	debug(`Finding a trivia question for user ${user.id}...`);
	const question = await controller(user).getTriviaQuestion(msg.from.id);
	await bot.sendMessage(msg.chat.id, question.text, {
		reply_markup: {
			inline_keyboard: [format(question.winner)(question.answers)],
		},
	});
	return Promise.resolve();
};
