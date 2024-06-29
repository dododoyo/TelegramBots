import { Context, Telegraf, Scenes } from "telegraf";
// import { Update } from 'telegraf/typings/core/types/typegram';
import createDebug from "debug";
const debug = createDebug("bot:dev");

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}

interface MyContext extends Context {
  session: MySession;

  scene: Scenes.SceneContextScene<MyContext>;
}

const development = async (bot: Telegraf<MyContext>) => {
  const botInfo = (await bot.telegram.getMe()).username;

  debug("Bot runs in development mode");
  debug(`${botInfo} deleting webhook`);
  await bot.telegram.deleteWebhook();
  debug(`${botInfo} starting polling`);

  await bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

export { development };
