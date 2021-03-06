require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const config = require('../config');
const initBot = require('./components/bot/index.js');
const initCms = require('./components/cms');
const initDb = require('./components/db');
const initS3 = require('./components/s3');
const initController = require('./components/controller');

module.exports.start = async () => {
	console.log('Starting guajirobot system');
	const cms = await initCms(config.airtable).start();
	const db = await initDb(config.db).start();
	const s3 = await initS3(config.s3).start();
	const controller = await initController().start({ cms, db, s3 });
	const bot = await initBot(config.bot).start({ controller });
	return bot;
};
