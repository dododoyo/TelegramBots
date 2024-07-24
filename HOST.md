Telegram supports two ways of interacting with the messages that users send to its bots. One of them is using webhooks. This method fits perfectly with serverless functions.

Prepare, what you need first
Create telegram bot — use Botfather, and keep your Telegram authorization token.
Create a Vercel account. Head to the signup page and create a new account using your GitHub, GitLab, or BitBucket account.
Create a basic Node.js project using npm.
Install dependency: telegraf — Bot API framework for Node.js
Install devDependencies, (need for Typescript): @vercel/node, typescript, @types/node, @vercel/ncc
npm i telegraf
npm i -D @vercel/node typescript @types/node @vercel/ncc 6. Create tsconfig.json file. public folder is default vercel build folder.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "esnext",
    "moduleResolution": "node",
    "module": "commonjs",
    "outDir": "public",
    "lib": ["esnext", "dom"],
    "resolveJsonModule": true
  },
  "exclude": ["node_modules"]
}
```

Creating the Telegram bot message handler
Telegram expects to call a webhook by sending us a POST request when a message is send by the user. Let’s build the message handler to receive this.

```typescript
// src/index.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { greeting } from "./greeting";

//VERCEL_URL is a system vercel env
const VERCEL_URL = `${process.env.VERCEL_URL}`;
//BOT_TOKEN - authorisation token from Botfather
const BOT_TOKEN = process.env.BOT_TOKEN || "";

const bot = new Telegraf(BOT_TOKEN);

//test simple greeting function
bot.on("message", greeting());

export const messageHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  if (!VERCEL_URL) {
    throw new Error("VERCEL_URL is not set.");
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + "/api") {
    await bot.telegram.deleteWebhook();
    await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
  }

  if (req.method === "POST") {
    await bot.handleUpdate(req.body as unknown as Update, res);
  } else {
    res.status(200).json("Listening to bot events...");
  }
};
```

Let’s add some function for greeting people who will use our bot

```typescript
// src/greeting.ts

import { Context } from 'telegraf'

export const greeting = () => async (ctx: Context) => {
  const messageId = ctx.message?.message_id
  const replyText = `Hello ${ctx.message?.from.first_name}`

  if (messageId) {
    await ctx.reply(replyText, { reply_to_message_id: messageId })
  }
}
Creating Vercel serverless function
Making a new serverless function is easy. Just create directory called /api in the root of your project. Inside that directory you can add an exported function and it will appear as an API route. Let's add a new function to handle our Telegram messages.
```

```typescript
// api/index.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import { startVercel } from "../src";

export default async function handle(req: VercelRequest, res: VercelResponse) {
  try {
    await startVercel(req, res);
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
    console.error(e.message);
  }
}
```

Setting up build command
To build telegram bot use @vercel/ncc cli. It compiling a Node.js module into a single file. Add build script in your package.json

"build": "ncc build src/index.ts -o public -m"
Deploying to Vercel
First you need to push your project to any Git provider. After that you can import a repository from Vercel or push it directly via Vercel CLI.

Don’t forget to add a BOT_TOKEN environment variable before deploying telegram bot.

And that’s it. You’ve now got a serverless Telegram bot deployed to Vercel which can respond to user messages. Try typing some message in Telegram to your bot and check that it responds correctly.

Test functions
Check your network — click on button View Function Logs . If all ok you’ll see telegram api requests

And finally…
I have created a template for launching the application locally and getting an easy start on Deploying to Vercel. Try it, if you don’t want to write a boilerplate code
