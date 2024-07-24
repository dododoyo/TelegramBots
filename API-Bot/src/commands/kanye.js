const axios = require("axios");

module.exports = (bot) => {
  bot.command(["kanye", "Kanye"], async (ctx) => {
    try {
      await ctx.sendChatAction("typing");
      await ctx.reply("Here is a random Kanye West Quote");
      const response = await axios.get(process.env.KANYE_PROVIDER);
      await ctx.reply(response.data.quote, {
        reply_to_message_id: ctx.message.message_id,
      });
    } catch (error) {
      await ctx.reply("Something went wrong, Try Again. 🤗");
      console.log("Something went wrong when handling a kanye request.");
    }
  });
};
