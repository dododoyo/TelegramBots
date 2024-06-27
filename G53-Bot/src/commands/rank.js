const axios = require("axios");
const crypto = require("crypto");
module.exports = async (bot) => {
  bot.command(["rank"], async (ctx) => {
    try {
      const currentTime = String(Math.floor(new Date().getTime() / 1000));
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const params = {
        apiKey: process.env.API_KEY,
        checkHistoricHandles: false,
        handles: process.env.USERS,
        time: currentTime,
      };
      const sortedParamString = Object.entries(params)
        .sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      const stringToHash = `${randomNumber}/user.info?${sortedParamString}#${process.env.API_SECRET}`;

      const shaEncode = crypto
        .createHash("sha512")
        .update(stringToHash)
        .digest("hex");

      const requestURL = `${process.env.API_REQ}${sortedParamString}&apiSig=${randomNumber}${shaEncode}`;

      const response = await axios(requestURL);
      if (response.data.status === "OK") {
        const data = response.data.result;
        data.sort((a, b) => {
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          return b.rating - a.rating;
        });
        ctx.session.group_data = data;
        await ctx.scene.enter("RANKING_SCENE");
      } else {
        try {
          await ctx.reply("Something went wrong when fetching data");
        } catch (error) {
          console.log("Something went wrong when replying to user");
          console.log(error.message);
        }
      }
      // console.log(response.data);
    } catch (error) {
      try {
        await ctx.reply("Something went wrong when fetching data");
      } catch (error) {
        console.log("Something went wrong when replying to user");
        console.log(error.message);
      }
      console.log("Something went wrong when fetching data");
      console.log(error.message);
    }
  });
};
