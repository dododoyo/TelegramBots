require("dotenv").config();
const { Telegraf, Scenes, session } = require("telegraf");
const stage = new Scenes.Stage();
let bot;

if (process.env.MODE === "development"){
  bot = new Telegraf(process.env.TEST_BOT_TOKEN);
}
else{
  bot = new Telegraf(process.env.BOT_TOKEN);
}
const ratingScene = require("../../src/scenes/ratingScene.js");
const rankingScene = require("../../src/scenes/rankingScene.js");

bot.use(
  session({
    defaultSession: () => ({}),
  })
);

bot.use((ctx, next) => {
	console.log(ctx?.update?.update_id,ctx?.update?.message?.from?.username,ctx?.update?.message?.text);
	next();
});

stage.register(ratingScene);
stage.register(rankingScene);
bot.use(stage.middleware());

const start_command = require("../../src/commands/start.js");
start_command(bot);
const help_command = require("../../src/commands/help.js");
help_command(bot);
const user_command = require("../../src/commands/user.js");
user_command(bot);
const rank_command = require("../../src/commands/rank.js");
rank_command(bot);

async function start_bot() {
  try {
    console.log("Starting bot. . .");
    await bot.launch();
  } catch (err) {
    console.log("An Error Ocurred: Restarting Bot");
    console.log(err);
  }
}

if (process.env.MODE === "development"){
  try {
         start_bot();
  } catch (error) {
      console.log("Bot Restarted");
      console.log(error);
  }
}
else{
  exports.handler = async event => {
    try {
      await bot.handleUpdate(JSON.parse(event.body))
      return { statusCode: 200, body: "" }
    } catch (e) {
      console.error("error in handler:", e)
      return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
    }
  }
}
