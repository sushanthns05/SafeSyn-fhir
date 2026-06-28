import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173');
  
  // click launch console
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Console') || text.includes('Launch')) {
      await btn.click();
      break;
    }
  }

  // wait a bit
  await new Promise(r => setTimeout(r, 1000));

  // click Fidelity and Utility
  const navBtns = await page.$$('.sidebar-nav-btn');
  for (const btn of navBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Fidelity')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  
  const barKeys = await page.evaluate(() => Object.keys(window.DEBUG_Bar || {}));
  const barType = await page.evaluate(() => typeof window.DEBUG_Bar);
  const barDefault = await page.evaluate(() => typeof (window.DEBUG_Bar && window.DEBUG_Bar.default));
  
  console.log("BAR KEYS:", barKeys);
  console.log("BAR TYPE:", barType);
  console.log("BAR DEFAULT:", barDefault);
  
  await browser.close();
})();
