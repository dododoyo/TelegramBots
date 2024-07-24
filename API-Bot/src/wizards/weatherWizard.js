const { WizardScene } = require("telegraf/scenes");
const axios = require("axios");

async function handleFocastRequest(ctx) {
  const user_location = ctx.session.user_location;

  const latitude = user_location.latitude;
  const longitude = user_location.longitude;

  const apiCall = `${process.env.WEATHER_API}forecast${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

  await ctx.sendChatAction("typing");

  const response = await axios(apiCall);
  try {
    let tomorrow = response.data.forecast.forecastday[0].date;
    let hours = response.data.forecast.forecastday[0].hour;
    let {
      maxtemp_c,
      mintemp_c,
      avgtemp_c,
      maxwind_mph,
      avghumidity,
      daily_chance_of_rain,
      daily_chance_of_snow,
      condition,
      uv,
    } = response.data.forecast.forecastday[0].day;

    const message = `The average weather condition for ${tomorrow} is <b>${condition.text}</b>

<b>Maximum Temperature</b> : ${maxtemp_c}°C
<b>Minimum Temperature</b> : ${mintemp_c}°C
<b>Average Temperature</b> : ${avgtemp_c}°C
<b>Average Humidity</b> : ${avghumidity}%
<b>Chance Of Rain</b> : ${daily_chance_of_rain}%
<b>Chance Of Snow</b> : ${daily_chance_of_rain}%
<b>Maximum Wind Speed</b>: ${maxwind_mph} mph
<b>UV Index</b> : ${uv}`;

    await ctx.reply(message, {
      reply_markup: { remove_keyboard: true },
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("Something went wrong when handling forecast weather request");
    console.log(err);
  }
}

/**********************************
  CURRENT REQUEST HANDLER
*********************************/
async function handleCurrentRequest(ctx) {
  const user_location = ctx.session.user_location;

  const latitude = user_location.latitude;
  const longitude = user_location.longitude;

  const apiCall = `${process.env.WEATHER_API}current${process.env.WEATHER_API_KEY}${process.env.WEATHER_API_ENDPOINTS}${latitude},${longitude}`;
  await ctx.sendChatAction("typing");

  try {
    const response = await axios.get(apiCall);
    const { name, country } = response.data.location;
    const time = response.data.location.localtime.split(" ")[1];
    const date = response.data.location.localtime.split(" ")[0];
    const mainWeather = response.data.current.condition.text;
    const temperature = response.data.current.temp_c;
    const is_day = response.data.current.is_day;
    const feelsLike = response.data.current.feelslike_c;
    const humidity = response.data.current.humidity;
    const windSpeed = response.data.current.wind_mph;
    const windDirection = response.data.current.wind_degree;
    const windDirectionDesc = response.data.current.wind_dir;
    const cloudiness = response.data.current.cloud;

    const message = `The weather condition in ${name}, ${country} is currently <b>${mainWeather}</b>
With a temperature of <b>${temperature}°C</b>
Human perception (feels like <b>${feelsLike}°C</b>)
Humidity is <b>${humidity}%</b>
Time : ${time}(24H-format),${is_day ? "Day time" : "Night time"}
Date : <b>${date}</b>
Cloudiness is <b>${cloudiness}%</b>
Wind speed of <b>${windSpeed}</b> m/s with direction of <b>${windDirection}°</b>(${windDirectionDesc})`;

    await ctx.reply(message, {
      reply_markup: { remove_keyboard: true },
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("Something went wrong when handling current weather request");
    console.log(err);
  }
}

/**********************************
  ASTRONOMY REQUEST HANDLER
*********************************/
async function handleAstronomyRequest(ctx) {
  const user_location = ctx.session.user_location;

  const latitude = user_location.latitude;
  const longitude = user_location.longitude;

  const apiCall = `${process.env.WEATHER_API}astronomy${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

  const response = await axios(apiCall);
  await ctx.deleteMessage();
  const { name, country, localtime_epoch } = response.data.location;
  const date = new Date(localtime_epoch * 1000);
  const formattedDate = date.toLocaleString();
  const { sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination } =
    response.data.astronomy.astro;

  await ctx.reply(
    `<b>Location</b>: ${name}, ${country}

<b>Date</b>: ${formattedDate}

<b>Sunrise</b> at ${sunrise}

<b>Sunset</b> at ${sunset}

<b>Moonrise</b> at ${moonrise}

<b>Moonset</b> at ${moonset}

Phase of Moon is <b>${moon_phase}</b>

<b>${moon_illumination}</b> percent of the moon is visible
`,
    { parse_mode: "HTML" }
  );
}

const STEP_1 = async (ctx) => {
  await ctx.reply("Please select a Service.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Forecast 🌤️", callback_data: "weather_api_forecast" }],
        [
          {
            text: "Current Conditions ☁️",
            callback_data: "weather_api_current",
          },
        ],
        [{ text: "Astronomy 🌙", callback_data: "weather_api_astro" }],
        [
          {
            text: `🏠 Home`,
            callback_data: "home",
          },
        ],
      ],
    },
  });
  return ctx.wizard.next();
};

const STEP_2 = async (ctx) => {
  if (ctx.updateType === "message" && ctx.update.message.text === "/cancel") {
    await ctx.reply("Hit /start to continue.");
    return ctx.scene.leave();
  }

  if (ctx.updateType !== "callback_query") {
    await ctx.reply("Invalid entry. Select only from the provided buttons");
    return;
  }

  const user_selection = ctx.update.callback_query.data;
  ctx.session.user_selection = user_selection;

  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.log("Couldn't delete message.");
  }

  let message = `Please share your location, and
Make sure location is <b>ON</b>
Sharing location may take time \n\nType /cancel to terminate the process.`;
  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [[{ text: "Share Location", request_location: true }]],
    },
  });
  return ctx.wizard.next();
};

const STEP_3 = async (ctx) => {
  if (ctx.updateType === "message" && ctx.update.message.text === "/cancel") {
    try {
      await ctx.deleteMessage();
      await ctx.reply("Hit /start to continue.", {
        reply_markup: { remove_keyboard: true },
      });
    } catch (error) {
      console.log("Couldn't delete message.");
    }
    return ctx.scene.leave();
  }
  if (
    ctx.updateType !== "message" ||
    ctx.update.message.location === undefined
  ) {
    await ctx.reply("Invalid entry. Select send only your Location");
    return;
  }

  const user_location = ctx.update.message.location;
  ctx.session.user_location = user_location;
  const user_selection = ctx.session.user_selection;

  try {
    await ctx.reply("Processing Data . . .", {
      reply_markup: { remove_keyboard: true },
    });
    if (user_selection === "weather_api_astro") {
      await handleAstronomyRequest(ctx);
    } else if (user_selection === "weather_api_forecast") {
      await handleFocastRequest(ctx);
    } else if (user_selection === "weather_api_current") {
      await handleCurrentRequest(ctx);
    } else {
      await ctx.reply("Invalid entries,Please Try Again 🤗.");
    }
  } catch (error) {
    console.log("Something went wrong when handlingWeatherAstronomy Request");
    await ctx.reply("Something went wrong, Try Again 🤗.");
    console.log(error.message);
  }

  return ctx.scene.leave();
};

const weatherWizard = new WizardScene("WEATHER_WIZARD", STEP_1, STEP_2, STEP_3);

weatherWizard.action(["home"], async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    await ctx.reply("Hit /start to continue.", {
      reply_markup: { remove_keyboard: true },
    });
  } catch (error) {
    console.log("Couldn't delete message.");
  }
  return ctx.scene.leave();
});

module.exports = weatherWizard;
