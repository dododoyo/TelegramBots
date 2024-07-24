module.exports = (bot) => {
  bot.command(["country", "Country"], (ctx) => {
    ctx.scene.enter("COUNTRY_WIZARD");
  });
};
