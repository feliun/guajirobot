const debug = require('debug')('guajirobot:bot:handler:trivia');

module.exports = (controller, bot) => async msg => {
	// bot.on('callback_query', msg => {
	//   console.log(JSON.stringify(msg));
	// });

	const format = answers => answers.map((answer, index) => ({
		text: answer.text,
		callback_data: `question:1,answer:${index}`,
	}));

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
