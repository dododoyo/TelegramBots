module.exports = (bot) => {
  bot.command(["NEWS", "News", "news"], async (ctx) => {
    ctx.scene.enter("NEWS_WIZARD");
  });
};
