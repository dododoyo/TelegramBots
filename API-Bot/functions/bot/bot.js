require("dotenv").config({ path: "../../.env" });

const { Telegraf, session } = require("telegraf");
const { message } = require("telegraf/filters");

// for deployment
// const bot = new Telegraf(process.env.BOT_TOKEN);

/**********************************
  for local testing 
*********************************/
const bot = new Telegraf(process.env.TEST_BOT_TOKEN);

bot.use(session({ defaultSession: () => ({}) }));

// console.log(bot.session);

// start command 
const start_command = require("../../src/commands/start")
start_command(bot)

// help command 
const help_command = require("../../src/commands/help")
help_command(bot)

// kanye command 
const kanye_command = require("../../src/commands/kanye")
kanye_command(bot)

// joke command 
const joke_command = require("../../src/commands/joke")
joke_command(bot)

// news command 
const news_command = require("../../src/commands/news")
news_command(bot)

// weather command 
const weather_command = require("../../src/commands/weather")
weather_command(bot)

// picture command 
const picture_command = require("../../src/inline/picture")
picture_command(bot)


function start_bot() {
    try {
      console.log("Bot is running");
      bot.launch();
      // Enable graceful stop
      process.once("SIGINT", () => bot.stop("SIGINT"));
      process.once("SIGTERM", () => bot.stop("SIGTERM"));
    } catch (error) {
      console.log("An Error Ocurred.");
      console.log("Restarting Bot");
      start_bot()
    }
}

/**********************************
  start bot is for local testing 
*********************************/

start_bot()

exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" };
  } catch (e) {
    console.error("error in handler:", e);
    return {
      statusCode: 400,
      body: "This endpoint is meant for bot and telegram communication",
    };
  }
};
