// Load environment variables from .env file
require("dotenv").config();

// Import Telegraf library
const Telegraf = require('telegraf');

// Get Telegram bot token from environment variables
TELEGRAM_TOKEN = process.env.BOT_TOKEN;

// Create a new Telegraf bot instance
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.use((ctx, next) => {
  console.log(ctx.update);
  next();
});

bot.start((ctx) => {
  ctx.reply('Hello @' + ctx.from.username);
  // ctx.reply('Welcome To the Real World');
});

bot.help((ctx) => {
  ctx.reply('Hello there @'+ ctx.from.username+', how may i help you ?');
});

bot.settings((ctx) => {
  ctx.reply('Hello there, please select your settings ?');
});

const greetUser = (ctx) => {
  ctx.reply('Hello @' + ctx.from.username)
}

bot.command(['greet','Great'],(ctx) => {
  greetUser(ctx); 
})

bot.on('text', (ctx,next) => {
  ctx.reply(ctx.message.text);
  next()
})
bot.entity("hashtag", (ctx) => {
  const userText = ctx.message.text;
  const entities = ctx.message.entities;

  // print each hashtag
  entities.forEach((entity) => {
    ctx.reply(userText.slice(entity.offset, entity.offset + entity.length));
  });
  // other code to handle the hashtag
});

bot.on('sticker', (ctx) => {
  ctx.reply("🤗");
})

// Launch the bot  
bot.launch();

