const country_command = require("./country");
const default_command = require("./default");
const help_command = require("./help");
const joke_command = require("./joke");
const kanye_command = require("./kanye");
const news_command = require("./news");
const start_command = require("./start");
const weather_command = require("./weather");
const cancel_command = require("./cancel");

const picture_command = require("../inline/picture");

module.exports = {
  cancel_command,
  country_command,
  default_command,
  help_command,
  joke_command,
  kanye_command,
  news_command,
  start_command,
  weather_command,
  picture_command,
};
