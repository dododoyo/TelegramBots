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

const start_command = (bot: Telegraf<MyContext>) => {
  bot.command(["start"], async (ctx: MyContext) => {
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

      const requestURL = `${process.env.API_REQ}${sortedParamString}&apiSig=${randomNumber}${shaEncode}`;

      const response = await axios(requestURL);
      if (response.data.status === "OK") {
        const data = response.data.result;
        data.sort((a: any, b: any) => {
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          return b.rating - a.rating;
        });
        ctx.session.group_data = data;
        await ctx.scene.enter("RATING_SCENE");
      } else {
        try {
          await ctx.reply("Something went wrong when fetching data");
        } catch (error: any) {
          console.log("Something went wrong when replying to user");
          console.log(error.message);
        }
      }
      // console.log(response.data);
    } catch (error: any) {
      try {
        await ctx.reply("Something went wrong when fetching data");
      } catch (error: any) {
        console.log("Something went wrong when replying to user");
        console.log(error.message);
      }
      console.log("Something went wrong when fetching data");
      console.log(error.message);
    }
  });
};

export { start_command };
