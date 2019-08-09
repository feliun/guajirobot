process.env.SERVICE_ENV = process.env.SERVICE_ENV || 'test';
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV}` });
