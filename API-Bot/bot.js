require("dotenv").config();

const Telegraf = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const pexels = require("pexels");

const client = pexels.createClient(process.env.IMG_API_TOKEN);

bot.start((ctx) => {
  const user = ctx.from.username || ctx.from.first_name;
  const message = `
Hello @${user}, welcome! How can I assist you today?
Use /help for more information`;
  ctx.reply(message);
});

bot.help((ctx) => {
  const message = `
Available commands:

/start - Start the bot.

/kanye - Get a random Kanye-West quote.

/fortune - Get a virtual fortune cookie.

/joke - Get a random joke.

/photo - Get a picture based on your query.

/weather - Get current weather conditions.

/country <name> - Get a info about a country based on your query.

/help - Show this help message.
`;
  ctx.reply(message);
});

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

bot.command(["weather", "Weather"], (ctx) => {
  ctx.reply("Please share your live location", {
    reply_to_message_id: ctx.message.message_id,
  });

  bot.on("location", (ctx) => {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;
    const apiKey = process.env.WEATHER_API_KEY;
    const apiProvider = process.env.WEATHER_API_PROVIDER;

    const apiCall = `${apiProvider}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      axios
        .get(apiCall)
        .then(function (response) {
          // console.log(response);
          // console.log(response.data);
          const { name, weather, main, wind, clouds, dt } = response.data;
          const descriptiveWeather = weather[0].description;
          const mainWeather = weather[0].main;
          const temperature = main.temp;
          const feelsLike = main.feels_like;
          const humidity = main.humidity;
          const windSpeed = wind.speed;
          const windDirection = wind.deg;
          const cloudiness = clouds.all;
          // Convert Unix timestamp to human-readable date and time
          const date = new Date(dt * 1000);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();
          const message = `The weather in ${name} is currently ${mainWeather} (${descriptiveWeather}) 
With a temperature of ${temperature}°C
Human perception (feels like ${feelsLike}°C)
Humidity is ${humidity}%
Date : ${formattedDate}
Time : ${formattedTime}
Cloudiness is ${cloudiness}%
Wind speed of ${windSpeed} m/s and wind direction of ${windDirection}°.`;
          ctx.reply(message, { reply_to_message_id: ctx.message.message_id });
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  });
});

bot.command(["Photo", "photo"], (ctx) => {
  ctx.reply("Please enter a search query:", {
    reply_to_message_id: ctx.message.message_id,
  });
  bot.on("text", (ctx) => {
    const query = ctx.message.text;
    try {
      client.photos.search({ query, per_page: 1 }).then((response) => {
        const thePhoto = response.photos[0].src.medium;
        // console.log(response.photos[0].src);
        ctx.replyWithPhoto(
          { url: thePhoto },
          { reply_to_message_id: ctx.message.message_id }
        );
      });
    } catch (error) {
      console.log(error);
    }
  });
});

bot.command(["kanye", "Kanye"], (ctx) => {
  ctx.reply("Here is a random Kanye West Quote");
  axios
    .get(process.env.KANYE_PROVIDER)
    .then(function (response) {
      // handle success
      // console.log(response.data);
      ctx.reply(response.data.quote, {
        reply_to_message_id: ctx.message.message_id,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});
bot.command(["fortune", "Fortune"], (ctx) => {
  ctx.reply("🥠 your fortune reads", {
    reply_to_message_id: ctx.message.message_id,
  });
  axios
    .get(process.env.FORTUNE_PROVIDER)
    .then(function (response) {
      // handle success
      ctx.reply(response.data.text.split(":")[1]);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});
bot.command(["joke", "Joke"], (ctx) => {
  ctx.reply("Here is a random Joke.");
  axios
    .get(process.env.JOKE_PROVIDER)
    .then(function (response) {
      // handle success

      if (response.data.type === "twopart") {
        ctx.reply(response.data.setup);
        // Pause the program for 1.5 seconds
        setTimeout(function () {
          ctx.reply(response.data.delivery);
        }, 2000);
      } else {
        ctx.reply(response.data.joke);
      }
      // console.log(response.data);
      // console.log(response.data.type);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
});

bot.launch();
