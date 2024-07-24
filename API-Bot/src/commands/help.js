module.exports = (bot) => {
  bot.command(["help", "Help"], async (ctx) => {
    const help_message = `
This bot 🤖 is designed to entertain and inform you. You can use this bot anytime 🕒 and anywhere. 

ture - Get a picture based on your query. 📷
ther - Get current weather conditions. ☀️
s - Get the latest news. 📰
ntry - Get detail Information about a country. 🌍
ye - Get a random Kanye-West quote. 🎤
e - Get a random joke. 😄
p - Show this help message. ℹ️
    
 Fun 🎉, 
    `;
    await ctx.reply(help_message);
  });
};
