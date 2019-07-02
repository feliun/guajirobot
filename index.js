require('dotenv').config();
const config = require('./config');
const initBot = require('./bot');
const initCms = require('./cms');
const initDb = require('./db');

const start = async () => {
	const cms = await initCms(config.airtable).start();
	const db = await initDb(config.db).start();
	await initBot(config.bot).start({ cms, db });
};

console.log('Starting system...');
start();
