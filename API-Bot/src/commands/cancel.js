module.exports = (bot) => {
  bot.command(["cancel", "Cancel"], async (ctx) => {
    return ctx.scene.leave();
  });
};
