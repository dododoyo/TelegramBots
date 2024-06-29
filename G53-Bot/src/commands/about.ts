import { Context, Composer, Scenes, Telegraf } from "telegraf";
import createDebug from "debug";

import { author, name, version } from "../../package.json";

const debug = createDebug("bot:about_command");

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}
interface MyContext extends Context {
  session: MySession;

  scene: Scenes.SceneContextScene<MyContext>;
}

const about_command = (bot: Telegraf<MyContext>) => {
  bot.command(["about"], async (ctx: MyContext) => {
    const message = `This Bot designed to inform G53 students about their ratings on *Codeforces*.`;
    debug(`Triggered "about" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: "Markdown" });
  });
};

export { about_command };
