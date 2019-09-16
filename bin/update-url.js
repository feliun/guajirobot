// https://hackernoon.com/serverless-telegram-bot-on-aws-lambda-851204d4236c
require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

const botToken = config.bot.token;
const url = process.env.DEPLOYMENT_URL;

const bot = new TelegramBot(botToken, { onlyFirstMatch: true });
bot.setWebHook(url);
