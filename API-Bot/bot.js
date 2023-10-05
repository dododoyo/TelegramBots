require("dotenv").config();

const Telegraf = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const pexels = require("pexels");
const fs = require("fs");
const { log } = require("console");

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
Here are some of the commands you can use:

- /start - Start the bot.
- /kanye - Get a random Kanye-West quote.
- /fortune - Get a virtual fortune cookie. 
- /joke - Get a random joke.
- /photo - Get a picture based on your query. This will ask you to enter a query, such as "a cat" or "a mountain", and then send you a picture related to your query.
- /weather - Get current weather conditions. This will ask you to share your current location and then send you the current weather conditions for that location, such as temperature, humidity, wind speed, etc.
- /country - Get info about a country based on your query. This will ask you to enter the name of a country, such as "China" or "Brazil", and then send you some information about that country, such as capital, population, currency, etc.
- /dogs - Get dog breeds. This will send you a list of dog breeds, and then ask you to choose one. After you choose one, it will send you a picture and some information about that dog breed.
- /help - Show this help message. This will show you the list of commands and their descriptions again.

This bot is designed to entertain and inform you. You can use this bot anytime and anywhere. Have fun with this bot! 😊
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
  ctx.reply("Please share your location", {
    reply_to_message_id: ctx.message.message_id,
    reply_markup:{keyboard:[[{text:"Share Location",request_location:true}]]}});

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
  inline_menu = [
    [{ text: "Any", callback_data: "Any" }],
    [
      { text: "Programming", callback_data: "Programming" },
      { text: "Dark", callback_data: "Dark" },
    ],
    [
      { text: "Miscellaneous", callback_data: "Miscellaneous" },
      { text: "Pun", callback_data: "Pun" },
    ],
    [
      { text: "Spooky", callback_data: "Spooky" },
      { text: "Christmas", callback_data: "Christmas" },
    ],
  ];

  ctx.reply("PLEASE SELECT  A CATEGORY",{reply_markup:{inline_keyboard:inline_menu}})
});

  bot.action(["Any","Miscellaneous","Dark","Pun","Spooky","Christmas","Programming"], async (ctx) => {
    ctx.answerCbQuery("Sending Joke")
    let menu = ctx;
    // console.log(ctx.match);

    try {
      response = await axios.get(process.env.JOKE_PROVIDER+ctx.match);
        // handle success

        if (response.data.type === "twopart") {
          ctx.reply(response.data.setup);
          // Pause the program for 1.5 seconds
          setTimeout(function () {
            ctx.reply(response.data.delivery);
          }, 4000);
        } else {
          ctx.reply(response.data.joke);
        }
        
        menu.deleteMessage();
        // console.log(response.data);
        // console.log(response.data.type);
      } catch (err) {
      console.log(err);
    }
  })

  bot.command("dogbreeds", (ctx) => {
    const data = fs.readFileSync("./dogbreeds.json", "utf-8")
    const breeds = JSON.parse(data);

    let msg = "Dog Breeds:\n"

    breeds.forEach((eachBreed) => {
      msg +=  `-${eachBreed}\n` 
    })
    ctx.reply(msg);
  })

  bot.command(["NEWS","News","news"], (ctx) => {
    try {
      axios.get(process.env.NEWS_PROVIDER).then((response) => {
        // console.log(response);
        console.log(response.statusText);
        if (response.statusText === "OK")
        {
          
          console.log(response.articles);
        }
        else{
          ctx.reply("Something went wrong try again")
        }
      })
    } catch (err) {
      console.log(err);
    }
  })

  function startBot() {
    try {
      bot.launch();
      console.log('Bot is running and live');
    } catch (err) {
      console.log(err);
      console.log('Restarting bot...');
      startBot();
    }
  }

  startBot();

