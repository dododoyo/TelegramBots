const axios = require("axios");
const crypto = require("crypto");
module.exports = (bot) => {
  bot.command(["user"], async (ctx) => {
    if (ctx.payload) {
      const waitMessage = await ctx.reply("Calculating User Rating. . . ");
      await ctx.sendChatAction("typing");

      try {

        const currentTime = String(Math.floor(new Date().getTime() / 1000));
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const params = {
          apiKey: process.env.API_KEY,
          checkHistoricHandles: false,
          handles: ctx.payload,
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

        const userRequestURL = `${process.env.API_REQ}${sortedParamString}&apiSig=${randomNumber}${shaEncode}`;
        // console.log(userRequestURL);
        const userResponse = await axios(userRequestURL);
        // console.log(userResponse);

        const groupParams = {
          apiKey: process.env.API_KEY,
          checkHistoricHandles: false,
          handles: process.env.USERS,
          time: currentTime,
        };
        const sortedParamStringGroup = Object.entries(groupParams)
          .sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        const stringToHashGroup = `${randomNumber}/user.info?${sortedParamString}#${process.env.API_SECRET}`;

        const shaEncodeGroup = crypto
          .createHash("sha512")
          .update(stringToHashGroup)
          .digest("hex");

        const requestURLGroup = `${process.env.API_REQ}${sortedParamStringGroup}&apiSig=${randomNumber}${shaEncodeGroup}`;
        const groupResponse = await axios.get(requestURLGroup);
        const data = groupResponse.data.result;
        data.sort((a, b) => {
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          return b.rating - a.rating;
        });
        
        if (userResponse.status === "FAILED") {
          try {
            await ctx.deleteMessage(waitMessage.message_id);
          } catch (error) {}
          await ctx.reply("Please enter a vaid username.");
        } else {
          const userData = userResponse.data.result[0];
          console.log(userData);
          const index = data.findIndex(
            (user) => user.handle === userData.handle
          );
          try {
            await ctx.deleteMessage(waitMessage.message_id);
            await ctx.reply(
              `[${userData.firstName || "NO Name"} /${
                userData.handle
              }/](https://codeforces.com/profile/${userData.handle})
  
  __CurrentRating__ : ${userData.rating || "Not rated"}
  __Rank__ : ${userData.rank || "Not rated"}
  __Rank from Group__ : ${index === -1 ? "Not in G53" : index + 1}
  __Maximum Rating__ : ${userData.maxRating || "Not rated"}
  __Maximum Rank__ : ${userData.maxRank || "Not rated"}`,
              {
                parse_mode: "MarkdownV2",
              }
            );
          } catch (error) {
            console.log("Something went wrong when replying to user");
            console.log(error.message);
          }
        }
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
    } else {
      try {
        await ctx.deleteMessage(waitMessage.message_id);
      } catch (error) {}
      await ctx.reply("Please enter username after /user command.");
    }
  });
};
