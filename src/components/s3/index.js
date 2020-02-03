const debug = require('debug')('guajirobot:s3');

module.exports = config => {
	const start = async () => {
        
        const uploadFile = async (source, destination) => {
            debug(`Copying file from url ${source} to path ${destination}...`);
            return Promise.resolve();
        };

		return {
			uploadFile,
		};
	};

	return {
		start,
	};
};
