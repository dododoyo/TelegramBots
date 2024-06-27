const {help_message} = require("../data/config.js")
module.exports = (bot) => {
  bot.command(["help"], async (ctx) => {
    try {
      await ctx.reply(help_message);
    } catch (error) {
      console.log("Something went wrong when replying to user");  
      console.log(error.message)
    }
  });
};