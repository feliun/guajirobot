const debug = require('debug')('guajirobot:cms');
const Airtable = require('airtable');

module.exports = ({ namespace, url, apiKey, base }) => {
	let airtable;
	let dictionary = {};

	const loadDictionary = async () => {
		let entries = [];

		const unique = list => [...new Set(list)];
		const clean = list => list.map(item => item);

		return new Promise((resolve, reject) => {
			airtable(namespace).select({
				maxRecords: 100,
				view: 'Grid view',
			}).eachPage((records, fetchNextPage) => {
				debug(`Retrieves ${records.length} dictionary entries...`);
				entries = entries.concat(records.map(record => record._rawJson.fields));
				fetchNextPage();
			}, err => {
				if (err) return reject(err);
				dictionary = entries.reduce((totalEntries, entry) => {
					const { Language, Input, Output } = entry;
					const inputList = clean(unique(Input.split('\n')));
					const outputList = clean(unique(Output.split('\n')));
					return inputList.reduce((total, input) => ({
						...totalEntries,
						[Language]: {
							...total[Language],
							[input]: outputList,
						},
					}), dictionary);
				}, {});
				debug(dictionary);
				return resolve();
			});
		});
	};

	const start = async () => {
		Airtable.configure({
			endpointUrl: url,
			apiKey,
		});
		airtable = Airtable.base(base);
		await loadDictionary();
		return {
			loadDictionary,
		};
	};

	return {
		start,
	};
};
