import { Telegraf, session, Context, Scenes } from "telegraf";
import { Stage } from "telegraf/scenes";
import { VercelRequest, VercelResponse } from "@vercel/node";

import {
  about_command,
  help_command,
  user_command,
  rank_command,
  start_command,
} from "./commands";
import { RankingScene, RatingScene } from "./scenes";
import { default_handler } from "./text";
import { development, production } from "./core";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const ENVIRONMENT = process.env.NODE_ENV || "";

interface MySession extends Scenes.SceneSession {
  group_data: any;
  current_index: number;
}

interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}

const bot = new Telegraf<MyContext>(BOT_TOKEN);
const stage = new Scenes.Stage<MyContext>([RankingScene, RatingScene]);

bot.use(
  session({
    defaultSession: () => ({ group_data: "what's up peps", current_index: 0 }),
  })
);
bot.use(stage.middleware());

about_command(bot);
help_command(bot);
rank_command(bot);
start_command(bot);
// user_command(bot);

default_handler(bot);

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

ENVIRONMENT !== "production" && development(bot);
