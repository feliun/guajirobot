const removeAccents = require('remove-accents');
const debug = require('debug')('guajirobot:cms:dictionary');

module.exports = async (airtable, namespace) => {
	const dictionary = {};
	const unique = list => [...new Set(list)];
	const byLanguage = language => ({ Language }) => Language === language;
	const removeSymbols = item => item.replace(/!|\?|¿|¡|,/g, '');
	const polish = item => removeSymbols(removeAccents(item));
	const toLowerCase = str => str.toLowerCase();
	const cleanList = list => list.map(polish).map(toLowerCase);
	const merge = (total, obj) => ({ ...total, ...obj });

	const loadDictionary = async () => {
		let entries = [];
		const isFilled = item => item.Input && item.Output && item.Language;

		const extractionByCategory = {
			Vocabulary: item => item.Output.split('\n'),
			Coordinates: item => ({
				captions: item.Output.split('\n'),
				longitude: item.Longitude,
				latitude: item.Latitude,
			}),
			Pictures: item => ({
				captions: item.Output.split('\n'),
				pictures: item.Picture.split('\n'),
			}),
		};

		const processVocabulary = language => entryList =>
			entryList
				.filter(byLanguage(language))
				.filter(isFilled)
				.map(item => {
					const { Input, Category } = item;
					return {
						inputList: cleanList(unique(Input.split('\n'))),
						outputData: {
							category: Category,
							data: extractionByCategory[Category](item),
						},
					};
				})
				.map(({ inputList, outputData }) => inputList.reduce((total, input) => ({
					...total,
					[input]: outputData,
				}), {}))
				.reduce(merge, {});

		console.log('Starting dictionary reload...');

		const english = 'EN';
		const spanish = 'ES';

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
				const processSpanish = processVocabulary(spanish);
				const processEnglish = processVocabulary(english);

				dictionary[spanish] = processSpanish(entries);
				dictionary[english] = processEnglish(entries);
				debug(JSON.stringify(dictionary, null, 2));
				return resolve();
			});
		});
	};

	const lookup = language => input => dictionary[language] && dictionary[language][polish(input)];
	await loadDictionary();
	return { lookup };
};
