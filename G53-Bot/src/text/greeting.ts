import { Scenes, Context, Composer, Telegraf } from "telegraf";
import createDebug from "debug";
const debug = createDebug("bot:greeting_text");

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}
interface MyContext extends Context {
  session: MySession;

  scene: Scenes.SceneContextScene<MyContext>;
}

const default_handler = (bot: Telegraf<MyContext>) => {
  bot.on(["message"], async (ctx: MyContext) => {
    const message = `*Feature is under maintainance or Doesn't Exitst 🤗.*`;
    debug(`Triggered "about" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: "Markdown" });
  });
};

export { default_handler };
