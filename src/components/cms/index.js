const debug = require('debug')('guajirobot:cms');
const Airtable = require('airtable');
const initDictionary = require('./dictionary');

module.exports = ({ url, apiKey, base, namespaces }) => {
	let airtable;
	const start = async () => {
		debug('Initialising cms...');
		Airtable.configure({
			endpointUrl: url,
			apiKey,
		});
		airtable = Airtable.base(base);
		const api = await initDictionary(airtable, namespaces.dictionary);
		return api;
	};

	return {
		start,
	};
};
