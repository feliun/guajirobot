require('dotenv').config();
const config = require('./config');
const initBot = require('./bot');
const initCms = require('./cms');
const initDb = require('./db');

const DICTIONARY_FREQUENCY = 5 * 60 * 1000; // 5 minutes

const start = async () => {
	console.log('Starting guajirobot system');
	const cms = await initCms(config.airtable).start();
	const db = await initDb(config.db).start();
	await initBot(config.bot).start({ cms, db });
	setInterval(async () => {
		console.log('Time to reload dictionary...');
		await cms.dictionary.load();
	}, DICTIONARY_FREQUENCY);
};

start();
