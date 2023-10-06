module.exports = (bot) => {

  bot.command(["country", "Country"], (ctx) => {
    let input = ctx.message.text;
  let inputArray = input.split(" ");
  
  if (inputArray.length === 1) {
    ctx.reply("Please enter a correct country name:", {
      reply_to_message_id: ctx.message.message_id,
    });
    bot.on("text", (ctx) => {
      const query = ctx.message.text;
      try {
        axios
        .get(process.env.COUNTRIES_API + query.toLowerCase())
          .then(function (response) {
            // handle success
            const country = response.data[0];
            // console.log(country);
            const resMsg = `
Common name : ${country.name.common}. 
Official name : ${country.name.official}.
Capital city : ${country.capital[0]}.
Alternate spellings: ${country.altSpellings.join(", ")}.
Located in ${country.subregion}, ${country.region}.
${
  country.landlocked
  ? "The country is landlocked (Has no direct access to the ocean)"
  : "The country is coastal (Has direct access to an ocean or sea)"
}.
Flag: ${country.flag}
Population : ${country.population}
${country.timezones.length === 1 ? "Timezone" : "Timezones"} : ${
  country.timezones
            }
  `;
  ctx.reply(resMsg, { reply_to_message_id: ctx.message.message_id });
  const capitalLocation = ctx.replyWithLocation(
              country.capitalInfo.latlng[0],
              country.capitalInfo.latlng[1]
              );
              capitalLocation.then((msg) => {
              ctx.reply("Capital's Location", {
                reply_to_message_id: msg.message_id,
              });
            });
          })
          .catch(function (error) {
            // handle error
            console.log("Something went wrong");
            console.log(error);

            ctx.reply("Something went wrong.");
            ctx.reply("Can't find the country.");
          });
      } catch (error) {
        console.log(error);
      }
    });
  } else if (inputArray.length > 1) {
    inputArray.shift();
    try {
      axios
      .get(process.env.COUNTRIES_API + inputArray.join(" ").toLowerCase())
      .then(function (response) {
          // handle success
          const country = response.data[0];
          // console.log(country);
          const resMsg = `
          Common name : ${country.name.common}. 
Official name : ${country.name.official}.
Capital city : ${country.capital[0]}.
Alternate spellings: ${country.altSpellings.join(", ")}.
Located in ${country.subregion}, ${country.region}.
${
  country.landlocked
    ? "The country is landlocked (Has no direct access to the ocean)"
    : "The country is coastal (Has direct access to an ocean or sea)"
}.
Flag: ${country.flag}
Population : ${country.population}
${country.timezones.length === 1 ? "Timezone" : "Timezones"} : ${
  country.timezones
}
`;
ctx.reply(resMsg, { reply_to_message_id: ctx.message.message_id });

const capitalLocation = ctx.replyWithLocation(
  country.capitalInfo.latlng[0],
  country.capitalInfo.latlng[1]
  );

  capitalLocation.then((msg) => {
    ctx.reply("Capital's Location", {
      reply_to_message_id: msg.message_id,
    });
          });
        })
        .catch(function (error) {
          // handle error
          console.log("Something went wrong");
          console.log(error);
          ctx.reply("Something went wrong.");
          ctx.reply("Can't find the country.");
        });
    } catch (error) {
      console.log(error);
    }
  }
});
}