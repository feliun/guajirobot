const debug = require('debug')('guajirobot:cms');
const Airtable = require('airtable');

module.exports = ({ namespace, url, apiKey, base }) => {
	let airtable;
	const dictionary = {};

	const loadDictionary = async () => {
		let entries = [];

		const unique = list => [...new Set(list)];
		const clean = list => list.map(item => item);
		const byLanguage = language => ({ Language }) => Language === language;
		const merge = (total, obj) => ({ ...total, ...obj });

		const processVocabulary = language => entryList =>
			entryList
				.filter(byLanguage(language))
				.map(({ Input, Output }) => ({
					inputList: clean(unique(Input.split('\n'))),
					outputList: clean(unique(Output.split('\n'))),
				}))
				.map(({ inputList, outputList }) => inputList.reduce((total, input) => ({
					...total,
					[input]: outputList,
				}), {}))
				.reduce(merge, {});

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
				const processSpanish = processVocabulary('ES');
				const processEnglish = processVocabulary('EN');

				dictionary.ES = processSpanish(entries);
				dictionary.EN = processEnglish(entries);
				debug(dictionary);
				return resolve();
			});
		});
	};

	const random = list => {
		if (!list) return null;
		return list[Math.floor(Math.random() * list.length)];
	};

	const lookupDictionary = language => word => random(dictionary[language] && dictionary[language][word]);

	const start = async () => {
		Airtable.configure({
			endpointUrl: url,
			apiKey,
		});
		airtable = Airtable.base(base);
		await loadDictionary();
		return {
			dictionary: {
				load: loadDictionary,
				lookup: lookupDictionary,
			},
		};
	};

	return {
		start,
	};
};
