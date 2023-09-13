require("dotenv").config();
const Telegraf = require('telegraf');

TELEGRAM_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome To the Real World');
});

bot.help((ctx) => {
  // console.log(ctx);
  // console.log(ctx.from);
  ctx.reply('Hello there @'+ ctx.from.username+', how may i help you ?');
});

bot.settings((ctx) => {
  ctx.reply('Hello there, please select your settings ?');
});

bot.hears("dog",(ctx) => {
  ctx.reply('WOOOF !!!');
})
// launch the bot  
bot.launch();

