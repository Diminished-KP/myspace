const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1280, height: 1200 });
  const filePath = `file://${path.join(__dirname, 'index.html')}`;
  console.log(`Loading ${filePath}...`);
  await page.goto(filePath);

  await page.waitForTimeout(1000);

  const screenshotPath = path.join(__dirname, 'jonas_myspace_updated.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);

  await browser.close();
})();
