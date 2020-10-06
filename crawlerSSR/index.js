require("dotenv").config();
const axios = require('axios').default;
const express = require("express");
const app = express();
const ssr = require("./ssr.js");


app.get("*", async (req, res, next) => {

  // Seperate handling for js file as puppeteer causes issues
  if (req.path === "/index_bundle.js") {
    try {
      console.log("starting index bundle GET");
      const url = `${process.env.CLIENT_ADDRESS}/index_bundle.js`;
      data = await (await axios.get(url)).data;
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500);
    }

  } else {
    // Use puppeteer to do SSR
    const { html, ttRenderMs } = await ssr(`${process.env.CLIENT_ADDRESS}${req.path}`);
    res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
    return res.status(200).send(html); // Serve prerendered page as response.
  }
});

app.listen(process.env.CRAWLER_SSR_PORT, () => console.log('Server started. Press Ctrl+C to quit'));