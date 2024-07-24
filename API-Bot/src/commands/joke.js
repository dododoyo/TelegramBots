module.exports = (bot) => {
  bot.command(["joke", "Joke"], async (ctx) => {
    ctx.scene.enter("JOKE_WIZARD");
  });
};
