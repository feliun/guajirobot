const debug = require('debug')('guajirobot:async');

module.exports = () => {
	const promises = {};

	const trigger = id => {
		debug(`Triggering promise for message id ${id}...`);
		promises[id]();
		delete promises[id];
	};

	const createHangingPromise = id => new Promise(resolve => {
		debug(`Creating promise for message id ${id}...`);
		promises[id] = resolve;
	});

	const promisify = fn => async msg => {
		const msgId = msg.message_id;
		try {
			await fn(msg);
		} catch (e) {
			console.error(`Error on handler: ${e.message}`);
		} finally {
			trigger(msgId);
		}
	};

	return {
		createHangingPromise,
		promisify,
	};
};
