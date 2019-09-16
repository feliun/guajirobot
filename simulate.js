require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const config = require('./config');
const system = require('./src/system');
const initServer = require('./src/components/server');

const init = async () => {
	const bot = await system.start();
	const { start } = initServer({ port: config.server.port });
	await start({ bot });
};

console.log('Starting up the simulated system...');
init();
