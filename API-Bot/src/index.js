require("dotenv").config();
const { Telegraf, session, Scenes } = require("telegraf");
const { Stage } = require("telegraf/scenes");

const { development, production } = require("./core");

const {
  cancel_command,
  country_command,
  default_command,
  help_command,
  joke_command,
  kanye_command,
  news_command,
  start_command,
  weather_command,
  picture_command,
} = require("./commands");

const {
  countryWizard,
  jokeWizard,
  newsWizard,
  weatherWizard,
} = require("./wizards");

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const ENVIRONMENT = process.env.NODE_ENV || "";

const bot = new Telegraf(BOT_TOKEN);

const stage = new Stage();
stage.register(countryWizard);
stage.register(jokeWizard);
stage.register(newsWizard);
stage.register(weatherWizard);

bot.use(session({ defaultSession: () => ({}) }));
bot.use(stage.middleware());

cancel_command(bot);
country_command(bot);
start_command(bot);
help_command(bot);
kanye_command(bot);
joke_command(bot);
news_command(bot);
weather_command(bot);
picture_command(bot);

default_command(bot);

module.exports.startVercel = async (req, res) => {
  await production(req, res, bot);
};

ENVIRONMENT !== "production" && development(bot);
