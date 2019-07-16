# guajirobot
A telegram bot to answer questions based on an airtable CMS, backed up by a Mongo DB database.

## Execution
´´´
docker run -d --name guajirobot --env BOT_TOKEN=$(BOT_TOKEN) --env AIRTABLE_KEY=$(AIRTABLE_KEY) --env AIRTABLE_BASE=$(AIRTABLE_BASE) --env MONGO_URL=$(MONGO_URL) --env SERVICE_ENV=$(SERVICE_ENV) --rm --network=local quay.io/feliun/guajirobot:latest
´´´