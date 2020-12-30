require("dotenv").config();
const axios = require('axios').default;
const express = require("express");
const app = express();
const ssr = require("./ssr.js");

const exemptUrls = ["/index_bundle.js", "/robots.txt", "/sitemap.xml"];
const exemptDirectories = [/^\/res\//, /^\/.well-known\//];

const isExempt = url => {
  if (exemptUrls.includes(url)) {
    return true;
  }

  for (const regex of exemptDirectories) {
    if (regex.test(url)) {
      return true;
    }
  }
  return false;
};

app.get("*", async (req, res, next) => {

  console.log("received req");

  // Seperate handling for js file as puppeteer causes issues
  if (isExempt(req.path)) {
    console.log(req.path + " is exempt from SSR");
    try {
      //console.log("starting index bundle GET");
      const url = `${process.env.CLIENT_ADDRESS}${req.path}`;
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

const port = process.env.CRAWLER_SSR_PORT || 3002;
app.listen(port, () =>
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port}. Press Ctrl+C to quit`)
);
