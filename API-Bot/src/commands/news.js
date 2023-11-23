const axios = require("axios");

module.exports = (bot) => {
  // function to display indicated article
  let allNews = []
  const displayArticle = async (index, ctx, allNews) => {
    const the_date = (allNews[index].publishedAt.split("T")[0]);
    const the_time = (allNews[index].publishedAt.split("T")[1]).slice(0,-4);
    await ctx.reply(
      `**Title** : ${allNews[index].title}

${allNews[index].description? (allNews[index].description):("*NEWS HAS NO DESCRIPTION*")}

[Link To News](${allNews[index].url})
*Source* : ${allNews[index].source.name}
*Published At* : ${the_date+", "+the_time}`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<< ${index == 9 ? 9 : index + 1} `,
                callback_data: "prev",
              },
              {
                text: `${index == 9 ? 10 : index + 2} >>`,
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
      await ctx.answerCbQuery("Selected " + ctx.match[0]);

      const API_CALL = `${process.env.NEWS_PROVIDER}${ctx.match[0]}${process.env.NEWS_API_KEY}`;

      try {
        const response = await axios(API_CALL);

        if (response.statusText === "OK") {
          await ctx.deleteMessage();
          allNews = response.data.articles;

          // console.log(allNews);
          let index = 0;

          displayArticle(0, ctx, allNews);

          bot.action(["prev", "next"], async (ctx) => {
            await ctx.deleteMessage();

            if (ctx.match[0] === "prev") {
              index = Math.max(index - 1, 0);
            } else if (ctx.match[0] === "next") {
              index = Math.min(index + 1, allNews.length - 1);
            }
            displayArticle(index, ctx, allNews);
          });
        } else {
          await ctx.reply("Something went wrong TRY AGAIN");
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  bot.command(["NEWS", "News", "news"], async (ctx) => {
    await ctx.reply("PLEASE SELECT CATEGORY", {
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
