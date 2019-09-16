const express = require('express'); // eslint-disable-line import/no-extraneous-dependencies
const bodyParser = require('body-parser'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = ({ port }) => {
	const start = async ({ bot }) => {
		const app = express();
		app.use(bodyParser.json());
		app.post('/bot', (req, res) => {
			bot.processUpdate(req.body);
			res.sendStatus(200);
		});
		app.listen(port, () => {
			console.log(`Express server is listening on ${port}`);
		});
	};

	return { start };
};
