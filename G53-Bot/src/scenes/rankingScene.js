const { Scenes } = require("telegraf");
const { users } = require("../data/config");

const displayRanking = async (index, ctx, first) => {
  const group_data = ctx.session.group_data;
  const last_index = group_data?.length - 1;
  const rankMessage = [];

  for (let i = index; i < index + 5; i++) {
    rankMessage.push(
      String(i + 1) +
        ` [${users[group_data[i].handle]}](https://codeforces.com/profile/${
          group_data[i].handle
        }) ` +
        `${group_data[i].rating || "Not rated"}` +
        "\n"
    );
  }
  const rankMessageString = rankMessage.join("");
  if (first) {
    try {
      await ctx.reply(rankMessageString, {
        parse_mode: "MarkdownV2",
        show_above_text: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `6 - 10 >>`,
                callback_data: "next",
              },
            ],
            [
              {
                text: "Cancel 🚫",
                callback_data: "back",
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.log("Something went wrong when replying to user");
      console.log(error);
      try {
        await ctx.reply("Something went wrong when displaying data")
      } catch (error) {
      }
    }
  } else if (index === last_index - 4) {
    try {
      await ctx.editMessageText(rankMessageString, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<<${index === 0 ? 5 : index - 4} - ${
                  index === 0 ? 1 : index
                }`,
                callback_data: "prev",
                callback_data: "prev",
              },
            ],
            [
              {
                text: "Cancel 🚫",
                callback_data: "back",
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.log("Something went wrong when replying to user");
      console.log(error);
      try {
        await ctx.reply("Something went wrong when displaying data")
      } catch (error) {
      }
    }
  } else {
    try {
      await ctx.editMessageText(rankMessageString, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<<${index === 0 ? 5 : index - 4} - ${
                  index === 0 ? 1 : index
                }`,
                callback_data: "prev",
              },
              {
                text: `${index === last_index ? last_index + 1 : index + 6} - ${
                  index === last_index ? last_index + 5 : index + 10
                } >>`,
                callback_data: "next",
              },
            ],
            [
              {
                text: "Cancel 🚫",
                callback_data: "back",
              },
            ],
          ],
        },
      });
    } catch (error) {

      try {
        await ctx.reply("Something went wrong when displaying data")
      } catch (error) {
        console.log("Something went wrong when replying to user");  
        console.log(error.message)
      }
      console.log(error);
    }
  }
};

/**
 * Base Scene To show User Rankings
 *
 * @class
 * @name RankingScene
 */

const RankingScene = new Scenes.BaseScene("RANKING_SCENE");

RankingScene.enter(async (ctx) => {
  displayRanking(0, ctx, true);
  ctx.session.current_index = 0;
});

RankingScene.action(["prev", "next"], async (ctx) => {
  let index = ctx.session.current_index;

  if (ctx.match[0] === "prev") {
    index = Math.max(index - 5, 0);
  } else if (ctx.match[0] === "next") {
    index = Math.min(index + 5, ctx.session.group_data.length - 1);
  }
  ctx.session.current_index = index;
  displayRanking(index, ctx, false);
});

RankingScene.action(["back"], async (ctx) => {
  try {
    
    await ctx.deleteMessage();
  } catch (error) {
    
  }
  return ctx.scene.leave();
});

module.exports = RankingScene;