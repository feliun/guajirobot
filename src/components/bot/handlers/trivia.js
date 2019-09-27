module.exports = (controller, bot) => async msg => {
	// bot.on('callback_query', msg => {
	//   console.log(JSON.stringify(msg));
	// });

	const questions = [
		{
			id: 1,
			question: 'When did we kiss for the first time?',
			answers: [
				{
					text: 'London',
					hit: false,
				},
				{
					text: 'Madrid',
					hit: false,
				},
				{
					text: 'In the middle of a flight',
					hit: true,
				},
			],
		},
	];

	await bot.sendMessage(msg.chat.id, questions[0].question, {
		reply_markup: {
			inline_keyboard: [
				[{
					text: questions[0].answers[0].text,
					callback_data: 'question:1,answer:0',
				}, {
					text: questions[0].answers[1].text,
					callback_data: 'question:1,answer:1',
				}, {
					text: questions[0].answers[2].text,
					callback_data: 'question:1,answer:2',
				},
				]],
		},
	});
	return Promise.resolve();
};
