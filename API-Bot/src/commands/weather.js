const axios = require("axios");

module.exports = (bot) => {
  const main_page = (ctx) => {
    ctx.reply("PLEASE SELECT PROVIDER", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Accu Weather", callback_data: "accu" }],
          [{ text: "Open Weather Map", callback_data: "open_map" }],
          [{ text: "Weather API", callback_data: "weather_api" }],
        ],
      },
    });
  };

W  const onLocationOpenMap = (ctx) => {
    // Weather API logic here
    // console.log("Location Recieved");
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;
    const apiKey = process.env.WEATHER_API_KEY;
    const apiProvider = process.env.WEATHER_API;

    const apiCall = `${apiProvider}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      axios
        .get(apiCall)
        .then((response) => {
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
          ctx.reply(message, {
            reply_markup: { remove_keyboard: true },
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  bot.on("location:open_map",onLocationOpenMap);

  bot.command(["weather", "Weather"], (ctx) => {
    main_page(ctx);

    /***********************
     * SETUP ACTION FOR EACH BUTTON
     * **********************/

    // ACTION FOR ACCU-WEATHER
    bot.action("accu", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();
      ctx.reply("PLEASE SELECT SERVICE", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Forcast", callback_data: "accu_forcast" }],
            [{ text: "Current Conditions", callback_data: "accu_current" }],
            [{ text: "Satellite Imagery", callback_data: "accu_image" }],
            [{ text: "<< Go Back", callback_data: "go_back" }],
          ],
        },
      });
    });

    // ACTION FOR OPEN MAP
    bot.action("open_map", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();
      ctx.reply("PLEASE SELECT SERVICE", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Current Conditions", callback_data: "openMap_current" }],
            [{ text: "<< Go Back", callback_data: "go_back" }],
          ],
        },
      });
    });

    // ACTION FOR WEATHER API
    bot.action("weather_api", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();

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
            [{ text: "<< Go Back", callback_data: "go_back" }],
          ],
        },
      });
    });

    // ACTION FOR GO-BACK
    bot.action("go_back", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();
      main_page(ctx);
    });

    // ACTION HANDLER FOR CURRENT WEATHER DATA WITH OPEN_WEATHER_MAP
    bot.action("openMap_current", (ctx) => {
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

      
      bot.on("location", (ctx) => {
        onLocationOpenMap(ctx);
      });
    });

    // ACTION HANDLER FOR ASTRONOMY DATA WITH WEATHER_API
    bot.action("weather_api_astro", (ctx) => {
      //ad go back for this also
      ctx.answerCbQuery();
      ctx.deleteMessage();
      let message = `Please share your location and

Make sure location is <b>ON</b>

Sharing location may take time`;
      ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [[{ text: "Share Location", request_location: true }]],
        },
      });
      bot.on("location", async (ctx) => {
        // console.log("Location Recieved");
        const latitude = ctx.message.location.latitude;
        const longitude = ctx.message.location.longitude;

        const apiCall = `${process.env.WEATHER_API}astronomy${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

        console.log(apiCall);

        const response = await axios(apiCall);
        console.log(response.data);
      });
    });

    // ACTION HANDLER FOR FORECAST DATA WITH WEATHER_API
    bot.action("weather_api_forecast", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();
      let message = `Please share your location and

Make sure location is <b>ON</b>

Sharing location may take time`;
      ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: "Share Location",
                request_location: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
      });

      bot.on("location", async (ctx) => {
        //not finished for each hour
        const latitude = ctx.message.location.latitude;
        const longitude = ctx.message.location.longitude;

        const apiCall = `${process.env.WEATHER_API}forecast${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;
        ctx.replyWithChatAction("typing");
        const response = await axios(apiCall);
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
        const message = `The average weather condition for ${tomorrow} is ${condition.text}

Maximum Temperature : ${maxtemp_c}°C

Minimum Temperature : ${mintemp_c}°C

Average Temperature : ${avgtemp_c}°C

Average Humidity : ${avghumidity}%

Chance Of Rain : ${daily_chance_of_rain}%

Chance Of Snow : ${daily_chance_of_rain}%

Maximum Wind Speed: ${maxwind_mph} mph

UV Index : ${uv}`;

        ctx.reply(message);
        // , {reply_markup: { remove_keyboard: true },}
        ctx.reply("<b>CLICK TO FIND DETAILS</b>", {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Get Details", callback_data: "detail_forecast" }],
            ],
          },
        });
      });
    });

    // ACTION HANDLER TO GET DETAIL FORECAST DATA WITH WEATHER_API
    bot.action("detail_forecast", (ctx) => {
      ctx.answerCbQuery();
      console.log("Received Request");
    });

    // ACTION HANDLER TO GET CURRENT WEATHER DATA FROM WEATHER_API
    bot.action("weather_api_current", (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage();

      let message = `Please share your location and

Make sure location is <b>ON</b>

Sharing location may take time`;
      ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [[{ text: "Share Location", request_location: true }]],
        },
      });

      bot.on("location", (ctx) => {
        // console.log("Location Recieved");
        const latitude = ctx.message.location.latitude;
        const longitude = ctx.message.location.longitude;

        const apiCall = `${process.env.WEATHER_API}current${process.env.WEATHER_API_KEY}${process.env.WEATHER_API_ENDPOINTS}${latitude},${longitude}`;

        // const response = await axios(apiCall);
        // console.log(response.data);

        // Show typing on top of chat
        ctx.replyWithChatAction("typing");

        try {
          axios.get(apiCall).then((response) => {
            // console.log(response);
            // console.log(response.data);

            const { name, country } = response.data.location;
            // const local_time = response.data.localtime;
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

            const message = `The weather condition in ${name}, ${country} is currently ${mainWeather}

With a temperature of ${temperature}°C

Human perception (feels like ${feelsLike}°C)

Humidity is ${humidity}%

Time : ${time}(24H-format), ${is_day ? "It's day time" : "It's night time"}

Date : ${date}

Cloudiness is ${cloudiness}%

Wind speed of ${windSpeed} m/s with direction of ${windDirection}°(${windDirectionDesc})`;

            ctx.reply(message, {
              reply_markup: { remove_keyboard: true },
            });
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
  });
};
