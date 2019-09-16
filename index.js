const { start } = require('./src/system');

module.exports.process = async event => {
	let response;
	const bot = await start();
	const input = JSON.parse(event.body);
	try {
		await bot.processUpdate(input);
		response = {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Bot informed about this input correctly',
				input: event,
			}),
		};
	} catch (e) {
		console.error(e);
		response = {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Error processing bot input...',
				error: e,
				input: event,
			}),
		};
	}
	return response;
};
