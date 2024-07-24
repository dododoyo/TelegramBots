module.exports = (bot) => {
  bot.command(["Start", "start"], async (ctx) => {
    const user = ctx.from.username || ctx.from.first_name || "user";
    const message = `Hello @${user}, Welcome!

Use /help for more info 🤖`;
    await ctx.reply(message);
  });
};
