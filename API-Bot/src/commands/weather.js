module.exports = (bot) => {
  bot.command(["weather", "Weather"], async (ctx) => {
    ctx.scene.enter("WEATHER_WIZARD");
  });
};
