import { VercelRequest, VercelResponse } from "@vercel/node";
import createDebug from "debug";
import { Context, Telegraf, Scenes } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

const debug = createDebug("bot:dev");

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const VERCEL_URL = `${process.env.VERCEL_URL}`;

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}
interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}

const production = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: Telegraf<MyContext>
) => {
  debug("Bot runs in production mode");
  debug(`setting webhook: ${VERCEL_URL}`);

  if (!VERCEL_URL) {
    throw new Error("VERCEL_URL is not set.");
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + "/api") {
    debug(`deleting webhook ${VERCEL_URL}`);
    await bot.telegram.deleteWebhook();
    debug(`setting webhook: ${VERCEL_URL}/api`);
    await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
  }

  if (req.method === "POST") {
    await bot.handleUpdate(req.body as unknown as Update, res);
  } else {
    res.status(200).json("Listening to bot events...");
  }
  debug(`starting webhook on port: ${PORT}`);
};
export { production };
