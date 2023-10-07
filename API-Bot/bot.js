require("dotenv").config();
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

const start_command = require("./src/commands/start.js")
start_command(bot);

const kanye_command = require("./src/commands/kanye.js")
kanye_command(bot);

const help_command = require("./src/commands/help.js")
help_command(bot);

const joke_command = require("./src/commands/joke.js")
joke_command(bot);

const picture_command = require("./src/inline/picture.js")
picture_command(bot);

const weather_command = require("./src/commands/weather.js")
weather_command(bot);

const news_command = require("./src/commands/news.js")
news_command(bot);


function startBot() {
  try {
    bot.launch();
    console.log('Bot is running and live');
  } catch (err) {
    console.log(err);
    console.log('Restarting bot...');
    startBot();
  }
}

startBot();

