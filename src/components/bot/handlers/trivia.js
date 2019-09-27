const debug = require('debug')('guajirobot:bot:handler:trivia');

module.exports = (controller, bot) => async msg => {
	// bot.on('callback_query', msg => {
	//   console.log(JSON.stringify(msg));
	// });
	const user = msg.from;
	debug(`Finding a trivia question for user ${user.id}...`);
	const question = await controller(user).getTriviaQuestion(msg.from.id);
	await bot.sendMessage(msg.chat.id, question.text, {
		reply_markup: {
			inline_keyboard: [
				[{
					text: question.answers[0].text,
					callback_data: 'question:1,answer:0',
				}, {
					text: question.answers[1].text,
					callback_data: 'question:1,answer:1',
				}, {
					text: question.answers[2].text,
					callback_data: 'question:1,answer:2',
				},
				]],
		},
	});
	return Promise.resolve();
};
