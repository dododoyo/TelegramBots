const { help_message } = require("../../config.js");

module.exports = (bot) => {
  bot.command(["help", "Help"], (ctx) => {
    ctx.reply(help_message);
  });
};
