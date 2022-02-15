const chromium = require('chrome-aws-lambda');

const width = 800;
const height = 300;
const maxage = 60 * 5;

const getContent = (song, album, artist) => {
  return `<html lang='en'> <meta charset="utf-8"> <title>Flare Header</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Courgette&display=swap" rel="stylesheet"> <style>*{margin: 0;padding: 0;box-sizing: border-box;font-family: "Comfortaa", cursive;}.header{width: ${width}px;height: ${height}px; font-size: 18px;position: relative;background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);display: grid;place-items: center;}h1{font-family: "Courgette", cursive;font-size: 32px}.header-bg{position: absolute;top: 0;left: 0;width: 100%;height: 100%;}.song-image{width: 200px;height: 200px;border-radius: 8px;}.content{color: #fff;display: flex;align-items: center;gap: 16px;}.subtitle{color: #c4cecf;margin: 4px 0;font-size: 14px;}footer{display: flex;position: absolute;top: 0;left: 0;width: 100%;align-items: center;justify-content: flex-end;padding: 12px;}.spotify-logo-container{color: #fff;display: flex;align-items: center;font-weight: medifum;}.spotify-logo{width: 30px;height: 30px;margin-right: 4px;}</style> <body> <div class="header"> <div class="content"> <div> <img class="song-image" src="https://i.scdn.co/image/ab67616d0000b27337bdb4ab21bb5795c22453b8" alt=""> </div><div> <p class="subtitle">I've been listening to</p><h1>${song}</h1> <p class="subtitle">from</p><h4>${album}</h4> <p class="subtitle">by</p><h4>${artist}</h4> </div></div><footer> <div class="spotify-logo-container"> <svg class="spotify-logo" viewBox="0 0 168 168"> <path fill="#1ED760" d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"></path> </svg> <p>Spotify</p></div></footer> </div></body></html>`;
};
exports.handler = async (event, context) => {
  console.log({ path: event.path });
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setContent(getContent('Test', 'test', 'test'), {
    waitUntil: 'networkidle2',
  });

  const screenshot = await page.screenshot({ type: 'png' });

  await browser.close();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, immutable, no-transform, s-maxage=${maxage}, max-age=${maxage}`,
    },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
  };
};
