import { Context, Composer, Telegraf, Scenes } from "telegraf";
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import * as crypto from "crypto";

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}

interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}

const user_command = (bot: Telegraf<MyContext>) => {
  bot.command(["user"], async (ctx) => {
    const waitMessage = await ctx.reply("Calculating User Rating. . . ");
    if (ctx.payload) {
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
          .sort(
            (a: any, b: any) =>
              a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])
          )
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        const stringToHash = `${randomNumber}/user.info?${sortedParamString}#${process.env.API_SECRET}`;

        const shaEncode = crypto
          .createHash("sha512")
          .update(stringToHash)
          .digest("hex");

        const userRequestURL = `${process.env.API_REQ}${sortedParamString}&apiSig=${randomNumber}${shaEncode}`;
        const userResponse: any = await axios(userRequestURL);
        // console.log(userResponse);

        const currentTime2 = String(Math.floor(new Date().getTime() / 1000));
        const randomNumber2 = Math.floor(100000 + Math.random() * 900000);
        const params2 = {
          apiKey: process.env.API_KEY,
          checkHistoricHandles: false,
          handles: process.env.USERS,
          time: currentTime2,
        };
        const sortedParamString2 = Object.entries(params2)
          .sort(
            (a: any, b: any) =>
              a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])
          )
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        const stringToHash2 = `${randomNumber2}/user.info?${sortedParamString2}#${process.env.API_SECRET}`;

        const shaEncode2 = crypto
          .createHash("sha512")
          .update(stringToHash2)
          .digest("hex");

        const requestURL = `${process.env.API_REQ}${sortedParamString2}&apiSig=${randomNumber2}${shaEncode2}`;

        const groupResponse = await axios(requestURL);
        const data = groupResponse.data.result;

        data.sort((a: any, b: any) => {
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
          const index = data.findIndex(
            (user: any) => user.handle === userData.handle
          );
          try {
            // await ctx.deleteMessage(waitMessage.message_id);
            await ctx.reply(
              `[${userData.firstName || "NO First Name"} ${userData.handle || "No User Handle"} ${userData.lastName || "NO Last Name"}](https://codeforces.com/profile/${userData.handle})
  
*CurrentRating* : ${userData.rating || "Not rated"}
*Rank* : ${userData.rank || "Not rated"}
*Rank from Group* : ${index === -1 ? "Not in G53" : index + 1}
*Maximum Rating* : ${userData.maxRating || "Not rated"}
*Maximum Rank* : ${userData.maxRank || "Not rated"}`,
              {
                parse_mode: "Markdown",
              }
            );
          } catch (error: any) {
            await ctx.reply("⚠️ Something went wrong *TRY AGAIN*", {
              parse_mode: "Markdown",
            });
            console.log("Something went wrong when replying to user");
            console.log(error.message);
          }
        }
      } catch (error: any) {
        try {
          await ctx.reply("⚠️ Something went wrong *TRY AGAIN*", {
            parse_mode: "Markdown",
          });
        } catch (error: any) {
          console.log("Something went wrong when replying to user");
          console.log(error.message);
        }
        console.log("Something went wrong when fetching data");
        console.log(error.message);
      }
    } else {
      // try {
      //   await ctx.deleteMessage(waitMessage.message_id);
      // } catch (error) {}
      await ctx.reply("Please enter username after /user command.");
    }
  });
};

export { user_command };