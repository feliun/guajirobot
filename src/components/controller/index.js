const debug = require('debug')('guajirobot:controller');

module.exports = () => {
	const start = async ({ cms, db, s3 }) => user => {
		const audit = fn => async (...args) => {
			const payload = {
				userId: user.id,
				fn: fn.name,
				args: [...args],
				timestamp: new Date(),
			};
			try {
				await Promise.all([db.audit(payload), db.updateProfile(user)]);
			} catch (e) {
				console.error(`Error auditing ${fn.name} execution: ${e.message}`);
			}
			const result = await fn(...args);
			return result;
		};

		const findPreferredLanguage = async () => {
			const { preferredLanguage = 'es' } = await db.getUser(user.id);
			const language = await preferredLanguage.toUpperCase();
			return language;
		};

		const findMatch = async input => {
			const language = await findPreferredLanguage();
			debug(`Looking up for input ${input} for user ${user.id} and language ${language}...`);
			const result = cms.dictionary.lookup(language)(input);
			if (result) return result;
			try {
				await db.storeUnmatched({ language, input, userId: user.id, timestamp: new Date() });
				return cms.dictionary.lookup(language)('fallback');
			} catch (e) {
				console.error(`Error storing unmatched input ${input}`);
			}
			return null;
		};

		const updateLanguage = async language => {
			debug(`Updating language ${language} for user ${user.id}...`);
			await db.updateLanguage(user.id, language);
			return Promise.resolve();
		};
		
		const uploadFile = async (url, fileId) => {
			debug(`Uploading file from url ${url} from user ${user.id}...`);
			const destination = `${user.id}/${fileId}`;
			await s3.uploadFile(url, destination);
			return Promise.resolve();
		};

		const difference = (list1, list2) => list1.filter(item => !list2.some(anotherItem => anotherItem.question === item.question));
		const random = list => list[Math.floor(Math.random() * list.length)];

		const getTriviaQuestion = async () => {
			const language = await findPreferredLanguage();
			const [questions, answered] = await Promise.all([
				cms.trivia.getQuestions(language),
				db.getTriviaAnswers(user.id),
			]);
			const options = difference(questions, answered);
			return Promise.resolve(random(options));
		};

		const registerTriviaAnswer = async (question, answer, hit) => {
			await db.recordTriviaAnswer({ userId: user.id, question, answer, hit, timestamp: new Date() });
			return Promise.resolve();
		};

		return {
			findMatch: audit(findMatch),
			updateLanguage: audit(updateLanguage),
			getTriviaQuestion: audit(getTriviaQuestion),
			uploadFile: audit(uploadFile),
			registerTriviaAnswer,
		};
	};

	return {
		start,
	};
};
