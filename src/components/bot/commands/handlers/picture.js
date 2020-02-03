module.exports = (controller, bot) => async msg => {
    const fileId = msg.photo[0] && msg.photo[0].file_id;
    const fileUrl = await bot.getFileLink(fileId);
    const user = msg.from;
    await controller(user).uploadFile(fileUrl);
	await bot.sendMessage(msg.chat.id, 'File uploaded! Thanks for sharing 📁');
};
