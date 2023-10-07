const axios = require("axios");
module.exports = (bot) => {

  const displayArticle = (index, ctx, allNews) => {
    ctx.reply(
      `**Title** : ${allNews[index].title}

${allNews[index].description}

[Link To News](${allNews[index].url})
**Source** : ${allNews[index].source.name}
**Published At** : ${allNews[index].publishedAt.split("T")}`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<< ${index}`,
                callback_data: "prev",
              },
              {
                text: `${index + 1} >>`,
                callback_data: "next",
              },
            ],
          ],
        },
      }
    );
  };

  bot.action(
    [
      "general",
      "science",
      "sports",
      "business",
      "health",
      "technology",
      "entertainment",
    ],

    async (ctx) => {
      ctx.answerCbQuery("Selected " + ctx.match);

      const API_CALL = `${process.env.NEWS_PROVIDER}${ctx.match}${process.env.NEWS_API_KEY}`;

      try {
        const response = await axios(API_CALL);

        if (response.statusText === "OK") {
          // console.log(response.data.articles[0]);
          ctx.deleteMessage();
          let allNews = response.data.articles;
          
          console.log(allNews);
          let index = 0;

          displayArticle(index, ctx, allNews);

          bot.action(["prev", "next"], async (ctx) => {
            ctx.deleteMessage();

            if (ctx.match === "prev") {
              index = Math.max(index - 1, 0);
            } else if (ctx.match === "next") {
              index = Math.min(index + 1, allNews.length - 1);
            }

            displayArticle(index, ctx, allNews);
          });
        } else {
          ctx.reply("Something went wrong TRY AGAIN");
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  bot.command(["NEWS", "News", "news"], async (ctx) => {
    ctx.reply("PLEASE SELECT CATEGORY", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Entertainment", callback_data: "entertainment" }],
          [
            { text: "Technology", callback_data: "technology" },
            { text: "Health", callback_data: "health" },
          ],
          [
            { text: "Business", callback_data: "business" },
            { text: "Sports", callback_data: "sports" },
          ],
          [
            { text: "General", callback_data: "general" },
            { text: "Science", callback_data: "science" },
          ],
        ],
      },
    });
  });
};
