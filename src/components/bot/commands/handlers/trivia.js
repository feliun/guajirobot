const debug = require('debug')('guajirobot:bot:commands:handler:trivia');

module.exports = (controller, bot) => async msg => {
	const format = (question, winner) => answers => answers.map((answer, index) => {
		// https://github.com/nickoala/telepot/issues/293#issuecomment-326426090
		const response = `command=trivia,q=${question},a=${index + 1},win=${winner === (index + 1)}`;
		return [{
			text: answer.text,
			callback_data: response,
		}];
	});
	const getChatId = msg => (msg.chat || msg.message.chat).id;
	const user = msg.from;
	const chatId = getChatId(msg);
	debug(`Finding a trivia question for user ${user.id}...`);
	const question = await controller(user).getTriviaQuestion(user.id);
	if (!question) {
		await bot.sendMessage(chatId, 'Game Finished! 🎮');
		return;
	}
	const choices = format(question.question, question.winner)(question.answers);
	await bot.sendMessage(chatId, question.text, {
		reply_markup: {
			inline_keyboard: choices,
		},
	});
};
