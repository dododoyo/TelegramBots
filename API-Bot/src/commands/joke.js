const axios = require("axios");
const reddit_jokes = require("../../reddit_jokes.json");
const stupidStuff_jokes = require("../../stupidstuff.json");
const wocka_jokes = require("../../wocka.json");
const joke_providers = new Map([
  ["stupid", stupidStuff_jokes],
  ["wocka", wocka_jokes],
]);

module.exports = (bot) => {
  bot.command(["joke", "Joke"], async (ctx) => {
    inline_menu = [
      [{ text: "Reddit", callback_data: "reddit" }],
      [{ text: "Stupid Stuff", callback_data: "stupid" }],
      [{ text: "Wocka", callback_data: "wocka" }],
    ];
    ctx.reply("SELECT JOKE PROVIDER", {
      reply_markup: {inline_keyboard: inline_menu},
      reply_to_message_id: ctx.message.message_id,
    });

    bot.action("reddit", (ctx) => {
      ctx.answerCbQuery();
      let random_index = Math.floor(Math.random() * 194553);

      ctx.deleteMessage();
      ctx.reply(reddit_jokes[random_index].title);

      setTimeout(() => {
        ctx.reply(reddit_jokes[random_index].body);
      }, 3000);
    });

    bot.action(["stupid", "wocka"], (ctx) => {
      ctx.answerCbQuery();
      // console.log(ctx.match);
      let random_index = Math.floor(
        Math.random() * joke_providers.get(ctx.match).length
      );

      ctx.deleteMessage();
      ctx.reply(joke_providers.get(ctx.match)[random_index].body);
    });
  });

  // bot.action(
  //   ["Any", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas", "Programming"],
  //   async (ctx) => {
  //     ctx.answerCbQuery("Sending Joke");
  //     let menu = ctx;
  //     // console.log(ctx.match);

  //     try {
  //       response = await axios.get(process.env.JOKE_PROVIDER + ctx.match);
  //       // handle success

  //       if (response.data.type === "twopart") {
  //         ctx.reply(response.data.setup);
  //         // Pause the program for 1.5 seconds
  //         setTimeout(function () {
  //           ctx.reply(response.data.delivery);
  //         }, 4000);
  //       } else {
  //         ctx.reply(response.data.joke);
  //       }

  //       menu.deleteMessage();
  //       // console.log(response.data);
  //       // console.log(response.data.type);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   );
};
