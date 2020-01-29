const debug = require('debug')('guajirobot:bot:callbacks:handler:replay');
const initTrivia = require('../../commands/handlers/trivia');

module.exports = (controller, bot) => async msg => {
    const getChatId = msg => (msg.chat || msg.message.chat).id;
    const triviaHandler = initTrivia(controller, bot);
    const wantMore = msg.data.continue === 'true';
    const chatId = getChatId(msg);
    debug(`Does the user want more questions?: ${wantMore}`);
    if (wantMore) {
        await triviaHandler(msg);
        return Promise.resolve();
    }
    await bot.sendMessage(chatId, '👋');
    return;
};
