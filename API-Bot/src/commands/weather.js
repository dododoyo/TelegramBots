const axios = require("axios");
const session = require("telegraf/session");

module.exports = (bot) => {
  bot.use(session());

  async function  handleFocastRequest(ctx) {
            
        const latitude = ctx.message.location.latitude;
        const longitude = ctx.message.location.longitude;

        const apiCall = `${process.env.WEATHER_API}forecast${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

        // console.log(apiCall);

        // Show typing on top of chat
        ctx.replyWithChatAction("typing");

        const response = await axios(apiCall);
        // console.log(response.data.forecast.forecastday[0]);
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
        // console.log(tomorrow);
        // console.log(condition);
        // console.log(hours);
        const message = `The average weather condition for ${tomorrow} is <b>${condition.text}</b>

<b>Maximum Temperature</b> : ${maxtemp_c}°C
<b>Minimum Temperature</b> : ${mintemp_c}°C
<b>Average Temperature</b> : ${avgtemp_c}°C
<b>Average Humidity</b> : ${avghumidity}%
<b>Chance Of Rain</b> : ${daily_chance_of_rain}%
<b>Chance Of Snow</b> : ${daily_chance_of_rain}%
<b>Maximum Wind Speed</b>: ${maxwind_mph} mph
<b>UV Index</b> : ${uv}`;

        ctx.reply(message, {
          reply_markup: { remove_keyboard: true },
          parse_mode:"HTML"
        });
  }
  function handleCurrentRequest(ctx) {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

    const apiCall = `${process.env.WEATHER_API}current${process.env.WEATHER_API_KEY}${process.env.WEATHER_API_ENDPOINTS}${latitude},${longitude}`;
    ctx.replyWithChatAction("typing");

    try {
      axios.get(apiCall).then((response) => {
        // console.log(response);
        // console.log(response.data);

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
Date : <b>${time}</b>
Cloudiness is <b>${cloudiness}%</b>
Wind speed of <b>${windSpeed}</b> m/s with direction of <b>${windDirection}°</b>(${windDirectionDesc})`;

        ctx.reply(message, {
          reply_markup: { remove_keyboard: true },
          parse_mode:"HTML",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function handleAstronomyRequest(ctx) {
            // console.log("Location Recieved");
        const latitude = ctx.message.location.latitude;
        const longitude = ctx.message.location.longitude;

        const apiCall = `${process.env.WEATHER_API}astronomy${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

        // console.log(apiCall);

        const response = await axios(apiCall);
        // console.log(response.data);

        ctx.deleteMessage();
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
        ctx.reply(
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

  function handleWeatherRequest(ctx, type) {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    let message = `Please share your location and
Make sure location is <b>ON</b>
Sharing location may take time`;
    ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [[{ text: "Share Location", request_location: true }]],
        one_time_keyboard: true,
      },
    });

    ctx.session.type = type;
  }
  bot.command(["weather", "Weather"], (ctx) => {
    // console.log(ctx.state.type);
    ctx.reply("PLEASE SELECT SERVICE", {
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

  bot.action("weather_api_astro", (ctx, next) => {
    handleWeatherRequest(ctx, "astronomy");
  });

  bot.action("weather_api_forecast", (ctx, next) => {
    handleWeatherRequest(ctx, "forecast");
  });
  bot.action("weather_api_current", (ctx) => {
    handleWeatherRequest(ctx, "current");
  });

  bot.on("location", async (ctx) => {
    // console.log(ctx.session.type);

    ctx.replyWithChatAction("typing");

    switch (ctx.session.type) {
      case "forecast":
        handleFocastRequest(ctx);
        break;
      case "current":
        handleCurrentRequest(ctx);
        break;
      case "astronomy":
        handleAstronomyRequest(ctx);
        break;
      default:
        ctx.reply("Something Went Wrong, Try Again");
        return;
    }
  });
};