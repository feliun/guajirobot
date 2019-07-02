const Airtable = require('airtable');

module.exports = ({ namespace, url, apiKey, base }) => {

  let airtable;

  const start = async () => {
    Airtable.configure({
        endpointUrl: url,
        apiKey,
    });

    airtable = Airtable.base(base);

    airtable(namespace).select({
      maxRecords: 1,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
          console.log('Retrieved', record._rawJson);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
    });
  };

  return {
    start
  };
};