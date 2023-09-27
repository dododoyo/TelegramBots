require('dotenv').config();
const { log } = require('console');
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const startMSG =`
Say something to me 
/start - starts the bot 
/help - command reference 
/echo - replies 'You said echo'
/echo <msg> - echos msg on chat`;
const helpMSG =`
List of Commands
/start - starts the bot 
/help - command reference 
/echo - replies 'You said echo'
/echo <msg> - echos msg on chat`;

bot.use((ctx,next) => {
  if (ctx.updateSubTypes[0] == "text"){
    // console.log("@" + ctx?.from?.username + " said " + ctx.message.text);
    // console.log(ctx.chat);
    bot.telegram.sendMessage(
      process.env.GROUP_ID,
      "@" + ctx?.from?.username + " said " + ctx.message.text
    );
  }
  else{
    // console.log('@' + ctx?.from?.username + ' sent a/an ' + ctx.updateSubTypes[0]);
    bot.telegram.sendMessage(
      process.env.GROUP_ID,
      "@" + ctx.from.username + " sent a/an " + ctx.updateSubTypes[0]
    );
  }
  next(ctx)
})

bot.start((ctx) => {
  ctx.reply(startMSG);
})
bot.help((ctx) => {
  ctx.reply(helpMSG);
})

bot.command(["echo"],(ctx) => {
  const msg = ctx.message;
  if (msg.text.length === 5){
    ctx.reply('You said echo');
  }
  else{
    ctx.reply(msg.text.substring(6,msg.text.length));
  }
})

bot.launch();