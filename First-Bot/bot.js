// Load environment variables from .env file
require("dotenv").config();

// Import Telegraf library
const Telegraf = require('telegraf');

// Get Telegram bot token from environment variables
TELEGRAM_TOKEN = process.env.BOT_TOKEN;

// Create a new Telegraf bot instance
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.use((ctx, next) => {
  // Set a property on the ctx.state object
  console.log(ctx.update);
  ctx.state.user = {
    id: ctx.from.id,
    name: ctx.from.first_name,
    age :23,
  };
  next();
});

bot.on("text", (ctx) => {
  // Access the property on the ctx.state object
  const user = ctx.state.user;
  ctx.reply(`Hello, ${user.name}!`);
  ctx.reply(`You are ${user.age} years old.`)
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

