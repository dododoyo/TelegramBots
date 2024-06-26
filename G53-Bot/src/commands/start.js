const axios = require("axios");

module.exports = async (bot) => {
  bot.command(["start"], async (ctx) => {
    try {
      const response = await axios(process.env.API_REQ);
      const data = response.data.result;
      data.sort((a, b) => {
        if (!a.rating) return 1;
        if (!b.rating) return -1;
        return b.rating - a.rating;
      });
      ctx.session.group_data = data;
    } catch (error) {
      console.log("Something went wrong when fetching data");
      console.log(error);
    }

    await ctx.scene.enter("RATINGS_SCENE");
  });
};
