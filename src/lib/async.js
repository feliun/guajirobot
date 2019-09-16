const debug = require('debug')('guajirobot:async');

module.exports = () => {
	const promises = {};

	const trigger = async id => {
		console.log(`Triggering promise for message id ${id}...`);
		promises[id]();
    delete promises[id];
    return Promise.resolve();
	};

	const createHangingPromise = id => new Promise(resolve => {
		console.log(`Creating promise for message id ${id}...`);
		promises[id] = resolve;
	});

	const promisify = fn => async msg => {
		const msgId = msg.message_id;
		try {
			await fn(msg);
		} catch (e) {
			console.error(`Error on handler: ${e.message}`);
    }
    return trigger(msgId);
	};

	return {
		createHangingPromise,
		promisify,
	};
};
