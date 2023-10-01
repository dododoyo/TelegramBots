// Load environment variables from .env file
require("dotenv").config();

// Import Telegraf library
const Telegraf = require("telegraf");
const axios = require("axios");

// Get Telegram bot token from environment variables
TELEGRAM_TOKEN = process.env.BOT_TOKEN;

// Create a new Telegraf bot instance
const bot = new Telegraf(TELEGRAM_TOKEN);

let factData = [];

/*
bot.use((ctx, next) => {
  // Set a property on the ctx.state object
  console.log(ctx.update);
  ctx.state.user = {
    id: ctx.from.id,
    name: ctx.from.first_name,
    age :23,
  };
  next();
});*/

/*
bot.entity("hashtag", (ctx) => {
  const userText = ctx.message.text;
  const entities = ctx.message.entities;

  // print each hashtag
  entities.forEach((entity) => {
    ctx.reply(userText.slice(entity.offset, entity.offset + entity.length));
  });
  // other code to handle the hashtag
});*/

bot.start((ctx) => {
  ctx.reply("Hello @" + ctx.from.username);
  // ctx.reply('Welcome To the Real World');
});

bot.help((ctx) => {
  ctx.reply("Hello there @" + ctx.from.username + ", how may i help you ?");
});

bot.settings((ctx) => {
  ctx.reply("Hello there, please select your settings ?");
});

bot.command(["greet", "Great"], (ctx) => {
  ctx.reply("Hello @" + ctx.from.username);
});

// bot.command(["Facts", "facts"], (ctx) => {
//   try {
//     axios
//       .get("https://api.api-ninjas.com/v1/facts?limit=3", {
//         headers: { "X-Api-Key": process.env.FACTS_API },
//       })
//       .then((response) => {
//         // console.log(response);
//         if (response.statusText === "OK") {
//           // console.log(response.data);
//           response.data.forEach((eachFact) => {
//             ctx.reply(eachFact.fact);
//           });
//         } else {
//           console.log(response);
//           ctx.reply("Something went wrong try again.");
//         }
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });
async function getData() {
  try {
    axios.get(process.env.GOOGLESHEET_LINK).then((response) => {
      const data = JSON.parse(response.data.substr(47).slice(0, -2));
      // console.log(typeof data);
      factData = [];

      if (data.status === "ok") {
        const rows = data.table.rows;
        for (let i = 0; i < rows.length; i++) {
          factData.push({ col: i + 1, data: rows[i].c });
        }
        // console.log(factData);
      } else {
        throw new Error();
      }
      // console.log(factData);
    });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

getData();

bot.command(["update", "Update"], async (ctx) => {
  try {
    await getData();
    ctx.reply("updated");
  } catch (err) {
    ctx.reply("Something went wrong, Try again");
    console.log(err);
  }
});

bot.command(["Fact", "fact"], async (ctx) => {
  // getData();
  try {
    const maxValue = factData[0].data[1].v;
    const randIndex = Math.floor(Math.random() * maxValue);
    // console.log(maxValue);
    const fact = factData[randIndex].data[4].v;
    // console.log(fact);
    const msg = `
Fact Number ${randIndex + 1}
${fact}  
`;
    ctx.reply(msg);
  } catch (err) {
    ctx.reply("Something went wrong, Try again");
    console.log(err);
  }
});

const startBot = () => {
  try {
    bot.launch();
    console.log("Bot is live. . .");
  } catch (err) {
    console.log(Error);
    console.log("Restarting bot . . .");
    startBot();
  }
};

startBot();
