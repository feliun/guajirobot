const debug = require('debug')('guajirobot:cms');
const Airtable = require('airtable');

module.exports = ({ namespace, url, apiKey, base }) => {
  let airtable;
  let dictionary = {};

  const loadDictionary = async () => {
    let entries = [];

    return new Promise((resolve, reject) => {
      airtable(namespace).select({
        maxRecords: 100,
        view: 'Grid view',
      }).eachPage((records, fetchNextPage) => {
        debug(`Retrieves ${records.length} records...`);
        entries = entries.concat(records.map((record) => record._rawJson.fields));
        fetchNextPage();
      }, err => {
        if (err) return reject(err);
        dictionary = entries.reduce((totalEntries, entry) => {
          const { Language, Input, Output } = entry;
          const inputList = [ ...new Set(Input.split('\n')) ];
          const outputList = [ ...new Set(Output.split('\n'))];
          return inputList.reduce((total, input) => {
            return {
              ...totalEntries,
              [Language]: {
                ...total[Language],
                [input]: outputList,
              }
            };
          }, dictionary);
        }, {});
        resolve();
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
