const debug = require('debug')('guajirobot:cms:trivia');

module.exports = async (airtable, namespace) => {
	const options = {};
	const byLanguage = language => ({ Language }) => Language === language;

	const loadTrivia = async () => {
		let entries = [];
		const isFilled = item => item.Question && item.Option1 && item.Option2 && item.Option3;

		const processOptions = language => entryList =>
			entryList
				.filter(byLanguage(language))
				.filter(isFilled)
				.map(item => ({
					text: item.Question,
					answers: [
						{ text: item.Option1 },
						{ text: item.Option2 },
						{ text: item.Option3 },
					],
				}));

		console.log('Starting trivia reload...');

		const english = 'EN';
		const spanish = 'ES';

		return new Promise((resolve, reject) => {
			airtable(namespace).select({
				maxRecords: 100,
				view: 'Grid view',
			}).eachPage((records, fetchNextPage) => {
				debug(`Retrieves ${records.length} trivia entries...`);
				entries = entries.concat(records.map(record => record._rawJson.fields));
				fetchNextPage();
			}, err => {
				if (err) return reject(err);
				const processSpanish = processOptions(spanish);
				const processEnglish = processOptions(english);

				options[spanish] = processSpanish(entries);
				options[english] = processEnglish(entries);
				debug(JSON.stringify(options, null, 2));
				return resolve();
			});
		});
	};
	const getQuestions = language => options[language];
	await loadTrivia();
	return { getQuestions };
};
