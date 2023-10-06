module.exports = (bot) => {
  bot.command(["NEWS", "News", "news"], (ctx) => {
    try {
      axios.get(process.env.NEWS_PROVIDER).then((response) => {
        // console.log(response);
        console.log(response.statusText);
      if (response.statusText === "OK") {
        console.log(response.articles);
      } else {
        ctx.reply("Something went wrong try again");
      }
    });
  } catch (err) {
    console.log(err);
  }
});
}