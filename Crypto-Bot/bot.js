require("dotenv");
const Telegraf = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
  const welcomeMSG = `Welcome this bot gives you crypto information.`;
  const inline_menu = [
    [{ text: "Crypto Prices", callback_data: "get_prices" }],
    [{ text: "CoinMarketCap", url: "https://coinmarketcap.com/" }],
    [{ text: "Bot Info", callback_data: "info" }],
  ];

  ctx.reply(welcomeMSG, { reply_markup: { inline_keyboard: inline_menu } });
});

bot.action(["info"], (ctx) => {
  ctx.answerCbQuery()
  const custom_keyboard = [
    [
      { text: "Credits"},
      { text: "API"},
    ],
    [
      { text: "Remove Keyboard"},
    ],
  ];
  ctx.reply("Bot Info", {
    reply_markup: { keyboard: custom_keyboard ,resize_keyboard: true,one_time_keyboard:true}, 
  });
});
bot.hears("Credits", (ctx => {
  ctx.reply(`Bot was made by @dododoyo`)
}))
bot.hears("API", (ctx => {
  ctx.reply(`This bot uses cryptocompare API`)
}))
bot.hears("Remove Keyboard", (ctx => {
  ctx.reply(`Removed Keyboard`,{reply_markup:{remove_keyboard:true}})
}))

const get_name = (abrv) => {
  let name = "";
  if (abrv === "ETH") {
    name = "Ethereum";
  } else if (abrv === "BTC") {
    name = "Bitcoin";
  } else if (abrv === "LTC") {
    name = "Litecoin";
  } else if (abrv === "USDT") {
    name = "Tether";
  } else if (abrv === "DOGE") {
    name = "";
  }
  return name;
};

bot.action("get_prices", (ctx) => {
  const priceMessage = `Select Price Information. Select on of the cryptocurrencies below.`;
  const inline_menu = [
    [
      { text: "BTC", callback_data: "BTC" },
      { text: "ETH", callback_data: "ETH" },
    ],
    [
      { text: "USDT", callback_data: "USDT" },
      { text: "DOGE", callback_data: "DOGE" },
    ],
    [{ text: "Go Back", callback_data: "main" }],
  ];

  ctx.deleteMessage();
  ctx.reply(priceMessage, { reply_markup: { inline_keyboard: inline_menu } });
});

bot.action(["BTC", "USDT", "ETH", "DOGE"], async (ctx) => {
  ctx.answerCbQuery("Fetching data . . .");
  const crypto = ctx.match;
  console.log(crypto);
  try {
    const response = await axios.get(
      process.env.CRYPTO_PROVIDER + crypto + process.env.END_POINTS
    );
    const data = response.data.DISPLAY[crypto];
    // console.log(data);
    const msg = `
**Price of - ${get_name(ctx.match)} ${data.USD.FROMSYMBOL}**

US Dollar - ${data.USD.PRICE}
Japanese Yen - ${data.JPY.PRICE}
Euro - ${data.EUR.PRICE} 

Open - ${data.USD.OPENDAY}
High - ${data.USD.HIGHDAY}
Low - ${data.USD.LOWDAY}
Supply - ${data.USD.SUPPLY}
Market Cap - ${data.USD.MKTCAP}
`;
    ctx.deleteMessage();
    ctx.reply(msg, {
      reply_markup: {
        inline_keyboard: [[{ text: "Go Back", callback_data: "get_prices" }]],
      },
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.log(err);
  }
});

bot.action("main", (ctx) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  const welcomeMSG = `Welcome this bot gives you crypto information.`;
  const inline_menu = [
    [{ text: "Crypto Prices", callback_data: "get_prices" }],
    [{ text: "CoinMarketCap", url: "https://coinmarketcap.com/" }],
  ];

  ctx.reply(welcomeMSG, { reply_markup: { inline_keyboard: inline_menu } });
});

const startBot = () => {
  try {
    bot.launch();
    console.log("Bot is live");
  } catch (err) {
    console.log(err);
    console.log("Starting the bot again");
    startBot();
  }
};

startBot();
