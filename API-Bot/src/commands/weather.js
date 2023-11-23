const axios = require("axios");

module.exports = (bot) => {
  /**********************************
  LOCATION REQUEST
*********************************/
  async function handleWeatherRequest(ctx, type) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();

    let message = `Please share your location and
Make sure location is <b>ON</b>
Sharing location may take time`;
    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [[{ text: "Share Location", request_location: true }]],
      },
    });
    ctx.session.type = type;
  }

  /**********************************
  FORECAST REQUEST HANDLER
*********************************/

  async function handleFocastRequest(ctx) {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

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
      console.log(
        "Something went wrong when handling forecast weather request"
      );
      console.log(err);
    }
  }

  /**********************************
  CURRENT REQUEST HANDLER
*********************************/
  async function handleCurrentRequest(ctx) {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

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
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

    const apiCall = `${process.env.WEATHER_API}astronomy${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

    try {
      const response = await axios(apiCall);

      // console.log(response.data);

      await ctx.deleteMessage();

      const { name, country, localtime_epoch } = response.data.location;
      const date = new Date(localtime_epoch * 1000);
      const formattedDate = date.toLocaleString();
      const {
        sunrise,
        sunset,
        moonrise,
        moonset,
        moon_phase,
        moon_illumination,
      } = response.data.astronomy.astro;

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
    } catch (error) {
      console.log("Something went wrong when handlingWeatherAstronomy Request");
      console.log(err);
    }
  }

  /**********************************
  WEATHER COMMAND HANDLER
*********************************/
  bot.command(["weather", "Weather"], async (ctx) => {
    // console.log(bot.session);

    await ctx.reply("PLEASE SELECT SERVICE", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Forecast", callback_data: "weather_api_forecast" }],
          [
            {
              text: "Current Conditions",
              callback_data: "weather_api_current",
            },
          ],
          [{ text: "Astronomy", callback_data: "weather_api_astro" }],
        ],
      },
    });
  });

  /**********************************
  BUTTON HANDLERS
*********************************/

  bot.action("weather_api_astro", async (ctx, next) => {
    await handleWeatherRequest(ctx, "astronomy");
  });

  bot.action("weather_api_forecast", async (ctx, next) => {
    await handleWeatherRequest(ctx, "forecast");
  });
  bot.action("weather_api_current", async (ctx) => {
    await handleWeatherRequest(ctx, "current");
  });

  /**********************************
 LOCATION DATA HANDLER
*********************************/

  bot.on("location", async (ctx) => {
    await ctx.sendChatAction("typing");

    switch (ctx.session.type) {
      case "forecast":
        await handleFocastRequest(ctx);
        break;
      case "current":
        await handleCurrentRequest(ctx);
        break;
      case "astronomy":
        await handleAstronomyRequest(ctx);
        break;
      default:
        await ctx.reply("Something Went Wrong, Try Again or restart bot /start");
        return;
    }
  });
};
