import { title } from "process";

require("dotenv");
const Telegraf = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command(["start", "help"], (ctx) => {
  let message = `
**Welcome to Search Bot**

Available Inline Modes

@q830bot pixa <search image>
@q830bot wiki <search wikipedia>
`;
  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Search Pixabay Images",
            switch_inline_query_current_chat: "pixa ",
          },
        ],
        [
          {
            text: "Search Wikipedia Articles",
            switch_inline_query_current_chat: "wiki ",
          },
        ],
      ],
    },
    parse_mode:"Markdown",
  });
});
// continuously listening for queries

bot.inlineQuery(/pixa\s.+/, async (ctx) => {
  // console.log(ctx.inlineQuery.query);
  let input = ctx.inlineQuery.query.split(" ");
  input.shift();
  let query = input.join(" ");

  let response = await axios(process.env.IMAGE_PROVIDER + query);
  console.log(response.statusText);
  let pictures = response.data.hits.map((each_picture) => {
    return {
      type: each_picture.type,
      id: each_picture.id,
      photo_url: each_picture.webformatURL,
      thumbnail_url: each_picture.previewURL,
      photo_width: each_picture.imageWidth,
      photo_height: each_picture.imageHeight,
      caption: `[Source](${each_picture.webformatURL})  [Larger File](${each_picture.largeImageURL})`,
      parse_mode: "Markdown",
    };
  });
  // console.log(pictures);

  ctx.answerInlineQuery(pictures);
});

bot.inlineQuery(["start","help"], (ctx) => {
  let message = `
**Welcome to Search Bot**

Available Inline Modes

@q830bot pixa <search image>
@q830bot wiki <search wikipedia>
`;
  let results = [
    {
      type: "article",
      id: "1",
      title: "Help Reference",
      input_message_content: {
        message_text: message,
        parse_mode: "Markdown",
      },
      description: "Sends help message on how to use the bot",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Search Pixabay Images",
              switch_inline_query_current_chat: "pixa ",
            },
          ],
          [
            {
              text: "Search Wikipedia Articles",
              switch_inline_query_current_chat: "wiki ",
            },
          ],
        ],
      },
    },
  ];
  ctx.answerInlineQuery(results)
})

bot.inlineQuery(/wiki\s.+/, async (ctx) => {
  // console.log(ctx.inlineQuery.query);
  let input = ctx.inlineQuery.query.split(" ");
  input.shift();
  let query = input.join(" ");
  let response = await axios.get(process.env.WIKI_API + query);

  let links = response.data[3];
  let titles = response.data[1];

  // console.log(titles);
  if (titles === undefined) {
    return;
  }

  let results = titles.map((each_title, index) => {
    let message = {
      message_text: `Link to Article : [${each_title}](${links[index]})`,
      parse_mode: "Markdown",
    };
    let inline_buttons = {
      inline_keyboard: [
        [{ text: `Share ${each_title}`, switch_inline_query: each_title }],
      ],
    };
    return {
      type: "article",
      id: String(index),
      title: each_title,
      input_message_content: message,
      description: links[index],
      reply_markup: inline_buttons,
    };
  });
  ctx.answerInlineQuery(results);
});

function start_bot() {
  try {
    console.log("Bot is live");
    bot.launch();
  } catch (err) {
    console.log("Error ocurred: Restarting Bot");
    console.log(err);
    start_bot();
  }
}

start_bot();
