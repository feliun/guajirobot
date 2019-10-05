const debug = require('debug')('guajirobot:cms');
const Airtable = require('airtable');
const initDictionary = require('./dictionary');
const initTrivia = require('./trivia');

module.exports = ({ url, apiKey, base, namespaces }) => {
	let airtable;
	const start = async () => {
		debug('Initialising cms...');
		Airtable.configure({
			endpointUrl: url,
			apiKey,
		});
		airtable = Airtable.base(base);
		const [dictionary, trivia] = await Promise.all([
			initDictionary(airtable, namespaces.dictionary),
			initTrivia(airtable, namespaces.trivia),
		]);
		return { dictionary, trivia };
	};

	return {
		start,
	};
};
