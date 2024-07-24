module.exports = (bot) => {
  bot.on(["message"], async (ctx) => {
    const message = `*Feature  Doesn't Exitst 🤗.*`;
    await ctx.reply(message, { parse_mode: "Markdown" });
  });
};

