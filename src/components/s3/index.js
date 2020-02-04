const request = require('request-promise');
const debug = require('debug')('guajirobot:s3');
const AWS = require('aws-sdk');

module.exports = config => {
    const s3 = new AWS.S3(); // use AWS_PROFILE if in local - lambda should have s3 permissions
	const start = async () => {

        const uploadFile = async (source, destination) => {
            debug(`Copying file from url ${source} to path ${destination}...`);
            const options = {
                uri: source,
                encoding: null
            };
            const body = await request(options);
            const result = await s3.upload({ 
                Bucket: config.bucket,
                Key: destination,
                Body: body
            }).promise();
            return Promise.resolve(result);
        };

		return {
			uploadFile,
		};
	};

	return {
		start,
	};
};
