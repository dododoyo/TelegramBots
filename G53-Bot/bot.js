require("dotenv").config();
const { Telegraf, Scenes ,session} = require("telegraf");
const stage = new Scenes.Stage();
const bot = new Telegraf(process.env.BOT_TOKEN);
const ratingScene = require("./src/scenes/ratingScene.js")

bot.use(
  session({
    defaultSession: () => ({}),
  })
);

stage.register(ratingScene);
bot.use(stage.middleware());

const start_command = require("./src/commands/start.js");
start_command(bot);
const help_command = require("./src/commands/help.js");
help_command(bot);
const user_command = require("./src/commands/user.js");
user_command(bot);

async function start_bot() {
  try {
    console.log("Starting bot. . .");
    await bot.launch();
  } catch (err) {
    console.log("An Error Ocurred: Restarting Bot");
    console.log(err);
  }
}
start_bot();
