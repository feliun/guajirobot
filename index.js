const config = require('./config');
const initBot = require('./bot');
const initCms = require('./cms');
const initDb = require('./db');

const start = async () => {
  const cms = await initCms().start();
  const db = await initDb().start(config);
  await initBot(process.env.BOT_TOKEN).start({ cms, db });
};

console.log('Starting system...');
start();