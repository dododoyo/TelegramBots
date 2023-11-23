const { help_message } = require("../../config.js");

module.exports = (bot) => {
  bot.command(["help", "Help"], async (ctx) => {
    await ctx.reply(help_message);
  });
};
