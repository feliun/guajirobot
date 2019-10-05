const debug = require('debug')('guajirobot:async');

module.exports = () => {
	const promises = {};

	const trigger = async id => {
		debug(`Triggering promise for message id ${id}...`);
		promises[id]();
		delete promises[id];
		return Promise.resolve();
	};

	const createHangingPromise = id => new Promise(resolve => {
		debug(`Creating promise for message id ${id}...`);
		promises[id] = resolve;
	});

	const extractMsgId = msg => {
		const envelope = msg.message || msg.callback_query.message;
		return envelope.message_id;
	};

	const promisify = fn => async msg => {
		const msgId = extractMsgId(msg);
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
