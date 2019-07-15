require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const config = require('./config');
const initBot = require('./src/components/bot/index.js');
const initCms = require('./src/components/cms');
const initDb = require('./src/components/db');
const initController = require('./src/components/controller');

const DICTIONARY_FREQUENCY = 5 * 60 * 1000; // 5 minutes

const start = async () => {
	console.log('Starting guajirobot system');
	const cms = await initCms(config.airtable).start();
	const db = await initDb(config.db).start();
	const controller = await initController().start({ cms, db });
	await initBot(config.bot).start({ controller });
	setInterval(async () => {
		console.log('Time to reload dictionary...');
		await cms.dictionary.load();
	}, DICTIONARY_FREQUENCY);
};

try {
	start();
} catch (err) {
	console.log('Error starting up!', err);
	process.exit(1);
}
