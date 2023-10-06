// const axios = require("axios")
require('dotenv')

// let config = {
//   headers: {
//     Authorization: process.env.PEXELS_API_TOKEN,
//   },
// };

// axios.get(process.env.PEXEL_ENDPOINTS + "nature", config).then(photos => {
//   console.log(photos);
// })

fetch("https://api.pexels.com/v1/search?query=people", {
  headers: {
    Authorization: process.env.PEXELS_API_TOKEN,
  },
})
  .then((resp) => {
    return resp.json();
  })
  .then((data) => {
    console.log(data);
    // console.log(data.photos);
  });