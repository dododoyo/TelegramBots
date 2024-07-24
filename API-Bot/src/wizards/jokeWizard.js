const { WizardScene } = require("telegraf/scenes");

const reddit_jokes = require("../data/reddit_jokes.json");
const stupidStuff_jokes = require("../data/stupidstuff.json");
const wocka_jokes = require("../data/wocka.json");

const joke_providers = new Map([
  ["stupid", stupidStuff_jokes],
  ["wocka", wocka_jokes],
]);

const STEP_1 = async (ctx) => {
  inline_menu = [
    [{ text: "Reddit", callback_data: "reddit" }],
    [{ text: "Stupid Stuff", callback_data: "stupid" }],
    [{ text: "Wocka", callback_data: "wocka" }],
  ];

  await ctx.reply("SELECT JOKE PROVIDER", {
    reply_markup: { inline_keyboard: inline_menu },
    reply_to_message_id: ctx.message.message_id,
  });
  return ctx.wizard.next();
};

const STEP_2 = async (ctx) => {
  try {
    if (ctx.updateType !== "callback_query") {
      await ctx.reply("Invalid entry. Select only from the provided buttons");
      return;
    }
    await ctx.answerCbQuery();

    const user_selection = ctx.update.callback_query.data;

    if (user_selection === "reddit") {
      await ctx.deleteMessage();
      await ctx.answerCbQuery("Selected Reddit");
      let random_index = Math.floor(Math.random() * 194553);

      await ctx.reply(reddit_jokes[random_index].title);
      await ctx.reply(reddit_jokes[random_index].body);
    } else if (user_selection === "stupid" || user_selection === "wocka") {
      await ctx.deleteMessage();
      await ctx.answerCbQuery(
        `Selected ${user_selection === "stupid" ? "Stupid Stuff" : "Wocka"}`
      );

      let random_index = Math.floor(
        Math.random() * joke_providers.get(user_selection).length
      );
      await ctx.reply(joke_providers.get(user_selection)[random_index].body);
    } else {
      await ctx.reply("Invalid entry. Select only from the provided buttons");
      return;
    }
  } catch (error) {
    await ctx.reply("Something went wrong try again. Try again 🤗");
    console.log(error);
  }

  return ctx.scene.leave();
};

const jokeWizard = new WizardScene("JOKE_WIZARD", STEP_1, STEP_2);

module.exports = jokeWizard;
