const {help_message} = require("../data/config.js")
module.exports = (bot) => {
  bot.command(["help"], async (ctx) => {

    await ctx.reply(help_message);
  });
};
