const { Scenes } = require("telegraf");
const { users } = require("../data/config");

const displayRating = async (index, ctx, first) => {
  const group_data = ctx.session.group_data;
  const last_index = group_data?.length - 1;

  if (first) {
    try {

    await ctx.reply(
      `[${users[group_data[index].handle]}](https://codeforces.com/profile/${
        group_data[index].handle
      })

__CurrentRating__ : ${group_data[index].rating || "Not rated"}
__Rank__ : ${group_data[index].rank || "Not rated"}
__Rank from Group__ : ${index + 1}
__Maximum Rating__ : ${group_data[index].maxRating || "Not rated"}`,
      {
        parse_mode: "MarkdownV2",
        show_above_text: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `${index == last_index ? last_index + 1 : index + 2} >>`,
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
      }
    );
  } catch (error) {
      
  }

  } else if (index == last_index) {
    await ctx.editMessageText(
      `[${group_data[index].handle}](https://codeforces.com/profile/${
        group_data[index].handle
      })

__CurrentRating__ : ${group_data[index].rating || "Not rated"}
__Rank__ : ${group_data[index].rank || "Not rated"}
__Rank from Group__ : ${index + 1}
__Maximum Rating__ : ${group_data[index].maxRating || "Not rated"}`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<< ${index == 0 ? 1 : index} `,
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
      }
    );
  } else {
    await ctx.editMessageText(
      `[${group_data[index].handle}](https://codeforces.com/profile/${
        group_data[index].handle
      })

__CurrentRating__ : ${group_data[index].rating || "Not rated"}
__Rank__ : ${group_data[index].rank || "Not rated"}
__Rank from Group__ : ${index + 1}
__Maximum Rating__ : ${group_data[index].maxRating || "Not rated"}`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `<< ${index == 0 ? 1 : index} `,
                callback_data: "prev",
              },
              {
                text: `${index == last_index ? last_index + 1 : index + 2} >>`,
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
      }
    );
  }
};

/**
 * Base Scene To show User Ratings
 *
 * @class
 * @name RatingScene
 */

const RatingScene = new Scenes.BaseScene("RATINGS_SCENE");

RatingScene.enter(async (ctx) => {
  displayRating(0, ctx, true);
  ctx.session.current_index = 0;
});

RatingScene.action(["prev", "next"], async (ctx) => {
  let index = ctx.session.current_index;

  if (ctx.match[0] === "prev") {
    index = Math.max(index - 1, 0);
  } else if (ctx.match[0] === "next") {
    index = Math.min(index + 1, ctx.session.group_data.length - 1);
  }
  ctx.session.current_index = index;
  displayRating(index, ctx, false);
});

RatingScene.action(["back"], async (ctx) => {
  await ctx.deleteMessage();
  return ctx.scene.leave();
});

module.exports = RatingScene;