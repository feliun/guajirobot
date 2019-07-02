module.exports = {
  bot: {
    token: process.env.BOT_TOKEN || 'bottokengoeshere',
  },
  airtable: {
    namespace: 'Content',
    url: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY || 'airtablekey',
    base: process.env.AIRTABLE_BASE || 'airtablebase',
  }
};