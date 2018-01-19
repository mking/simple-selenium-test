// https://developers.google.com/web/updates/2017/04/headless-chrome
// https://stackoverflow.com/questions/36429436/how-do-i-solve-server-terminated-early-with-status-127-when-running-node-js-on
// $ ./node_modules/chromedriver/bin/chromedriver
// error while loading shared libraries: libgconf-2.so.4: cannot open shared object file: No such file or directory

const {
  Browser,
  Builder,
  Capabilities,
  Key,
  until
} = require('selenium-webdriver');
const fs = require('fs');
const pify = require('pify');

require('chromedriver');

(async () => {
  try {
    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .withCapabilities(
        Capabilities.chrome().set('chromeOptions', {
          args: []
          // args: ['--headless']
        })
      )
      .build();
    await driver.get('https://www.google.com');
    await driver.findElement({ name: 'q' }).sendKeys('bitcoin', Key.ENTER);
    await driver.wait(until.titleIs('bitcoin - Google Search'), 1000);
    const screenshot = await driver.takeScreenshot();
    await pify(fs.writeFile)(
      'screenshot.png',
      Buffer.from(screenshot, 'base64')
    );
    await driver.quit();
  } catch (e) {
    console.error(e);
  }
})();
