const puppeteer = require("puppeteer");

// In-memory cache of rendered pages
const RENDER_CACHE = new Map();

const ssr = async url => {
  if (RENDER_CACHE.has(url)) {
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const start = Date.now();

  let browser;

  if (process.env.NODE_ENV === "development") {
    browser = await puppeteer.launch();
  } else {
    browser = await puppeteer.launch({ executablePath: "chromium-browser" });
  }

  let renderSucceeded = false;

  const page = await browser.newPage();
  try {
    console.log(`${url} start`);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60 * 1000 });

    // Remove privacy message and account popup
    await page.evaluate(() => {
      var elements = document.querySelectorAll("modal-background");
      for (let i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    });

    renderSucceeded = true;

  } catch (err) {
    console.error(err);
    renderSucceeded = false;
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);
  console.log(`${url} finish`);

  if (renderSucceeded) {
    RENDER_CACHE.set(url, html); // cache rendered page.
  }

  return { html, ttRenderMs };
};

module.exports = ssr;