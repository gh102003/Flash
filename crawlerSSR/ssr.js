const puppeteer = require("puppeteer");

// In-memory cache of rendered pages
const RENDER_CACHE = new Map();

const ssr = async url => {
  if (RENDER_CACHE.has(url)) {
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const start = Date.now();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    console.log(`${url} start`);

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Remove privacy message and account popup
    await page.evaluate(sel => {
      var elements = document.querySelectorAll(sel);
      for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }, "modal-background");

  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);
  console.log(`${url} stop`);

  RENDER_CACHE.set(url, html); // cache rendered page.

  return { html, ttRenderMs };
};

module.exports = ssr;