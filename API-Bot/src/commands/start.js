module.exports = (bot) => { 
  bot.start((ctx) => {
    const user = ctx.from.username || ctx.from.first_name;
    const message = `
Hello @${user}, welcome! How can I assist you?

Use /help for more information`;
    ctx.reply(message);
  });
}