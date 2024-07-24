module.exports = async (bot) => {
  const botInfo = (await bot.telegram.getMe()).username;

  console.log('Bot runs in development mode');
  console.log(`${botInfo} deleting webhook`);
  await bot.telegram.deleteWebhook();
  
  await bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};