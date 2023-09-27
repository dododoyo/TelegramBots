require("dotenv").config();

// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const startMSG = `
Hello there, I am a media bot.
I send pictures and texts use
/help to find out what i can do`;
  ctx.reply(startMSG);
});
bot.help((ctx) => {
  const helpMSG = `
Reference of commands
/start - Starts the bot.
/help to find out what i can do
/addis_ababa - Get image of Addis-Ababa.
/dubai - Get image of Dubai.
/new_york -Get GIF of New-York
/singapore_lctn - Get location of singapore.
/cities - Get photos of cities.
/cities_list - Get .txt file of cities list`;
  ctx.reply(helpMSG);
});
bot.command("addis_ababa", (ctx) => {
  ctx.replyWithChatAction("upload_photo");
  ctx.replyWithPhoto(
    { source: "./src/addis.jpeg" },
    { reply_to_message_id: ctx.message.message_id }
  );
});
bot.command("dubai", (ctx) => {
  ctx.replyWithChatAction("upload_photo");
  ctx.replyWithPhoto(
    { source: "./src/dubai.jpeg" },
    { reply_to_message_id: ctx.message.message_id }
  );
});
bot.command("new_york", (ctx) => {
  ctx.replyWithChatAction("upload_photo");
  ctx.replyWithAnimation(
    { source: "./src/newyork.gif" },
    { reply_to_message_id: ctx.message.message_id }
  );
});
bot.command("singapore_lctn", (ctx) => {
  ctx.replyWithChatAction("find_location");
  ctx.replyWithLocation(1.289558, 103.678489, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command("cities_list", (ctx) => {
  ctx.replyWithChatAction("upload_document");

  bot.telegram.sendDocument(ctx.chat.id,
    { source: "./src/citieslist.txt" },
    { thumbnail: { source: "./src/dubai.jpeg"} ,reply_to_message_id: ctx.message.message_id},
  );
});

bot.command("cities", (ctx) => {
  ctx.replyWithChatAction("upload_photo");
  const cities = [
    {
      type: "photo",
      media: { source: "./src/city-3.jpg" },
    },
    {
      type: "photo",
      media: { source: "./src/city-4.jpeg" },
    },
    {
      type: "photo",
      media: { source: "./src/addis.jpeg" },
    },
    {
      type: "photo",
      media: { source: "./src/dubai.jpeg" },
    },
  ];
  ctx.replyWithMediaGroup(cities, {
    reply_to_message_id: ctx.message.message_id,
  });
});

/*
bot.on("text", (ctx) => {
  readline.question(`User: ${ctx.message.text}\n`, (response) => {
    ctx.reply(response);
  });
});
*/

bot.launch();
