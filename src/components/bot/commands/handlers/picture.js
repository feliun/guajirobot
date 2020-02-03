module.exports = (controller, bot) => async msg => {
    const { file_id, file_unique_id} = msg.photo[0];
    const fileUrl = await bot.getFileLink(file_id);
    const user = msg.from;
    await controller(user).uploadFile(fileUrl, file_unique_id);
	await bot.sendMessage(msg.chat.id, 'File uploaded! Thanks for sharing 📁');
};
