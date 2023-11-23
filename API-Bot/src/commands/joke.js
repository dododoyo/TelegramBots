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
    await ctx.reply("SELECT JOKE PROVIDER", {
      reply_markup: { inline_keyboard: inline_menu },
      reply_to_message_id: ctx.message.message_id,
    });

    bot.action("reddit", async (ctx) => {
      await ctx.answerCbQuery("Selected Reddit");
      let random_index = Math.floor(Math.random() * 194553);

      await ctx.deleteMessage();
      await ctx.reply(reddit_jokes[random_index].title);
      await ctx.reply(reddit_jokes[random_index].body);
    });

    bot.action(["stupid", "wocka"], async (ctx) => {
      await ctx.answerCbQuery(`Selected ${ctx.match[0] === "stupid"? ("Stupid Stuff"):("Wocka")}`);
      console.log(ctx.match[0]);
      let random_index = Math.floor(
        Math.random() * joke_providers.get(ctx.match[0]).length
      );
      await ctx.deleteMessage();
      await ctx.reply(joke_providers.get(ctx.match[0])[random_index].body);
    });
  });
};
