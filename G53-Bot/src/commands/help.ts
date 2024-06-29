import { Context, Composer, Scenes, Telegraf } from "telegraf";
import { help_message } from "../data/config";

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}

interface MyContext extends Context {
  session: MySession;

  scene: Scenes.SceneContextScene<MyContext>;
}

const help_command = (bot: Telegraf<MyContext>) => {
  bot.command(["help"], async (ctx: MyContext) => {
    try {
      await ctx.reply(help_message);
    } catch (error: any) {
      console.log("Something went wrong when replying to user");
      console.log(error.message);
    }
  });
};

export { help_command };
