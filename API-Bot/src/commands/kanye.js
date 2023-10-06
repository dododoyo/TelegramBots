const axios = require("axios");
module.exports = (bot) => {
  bot.command(["kanye", "Kanye"], (ctx) => {
    ctx.reply("Here is a random Kanye West Quote");
    axios
      .get(process.env.KANYE_PROVIDER)
      .then(function (response) {
        // handle success
        // console.log(response.data);
        ctx.reply(response.data.quote, {
          reply_to_message_id: ctx.message.message_id,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });
};
