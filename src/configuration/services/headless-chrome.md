# Headless Chrome

Headless Chrome is a headless browser that can be configured on projects like any other service on Platform.sh. You can interact with the `headless-chrome` service container using Puppeteer, a Node library that provides an API to control Chrome over the DevTools Protocol. 

Puppeteer can be used to generate PDFs and screenshots of web pages, automate form submission, and test your project's UI. You can find out more information about using Puppeteer on [GitHub](https://github.com/GoogleChrome/puppeteer) or in their [documentation](https://pptr.dev/).

## Supported versions

* 73

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](/development/variables.md#platformsh-provided-variables):

```yaml
{
    "service": "headless",
    "ip": "169.254.73.96",
    "hostname": "3rxha4e2w4yv36lqlypy7qlkza.headless.service._.eu-3.platformsh.site",
    "cluster": "moqwtrvgc63mo-master-7rqtwti",
    "host": "headless.internal",
    "rel": "http",
    "scheme": "http",
    "type": "chrome-headless:73",
    "port": 9222
}

```

## Requirements

Puppeteer requires at least Node.js version 6.4.0, while using the async and await examples below requires Node 7.6.0 or greater. 

Using the Platform.sh [Config Reader](https://github.com/platformsh/config-reader-nodejs) library requires Node.js 10 or later.

### Other languages

It will be necessary to upgrade the version of Node.js in other language containers before using Puppeteer. You can use [Node Version Manager](https://github.com/nvm-sh/nvm) or NVM to change or update the version available in your application container by following the instructions in the [Alternate Node.js install](/languages/nodejs/nvm.html) documentation.

## Usage example

In your `.platform/services.yaml`:

```yaml
headless:
  type: chrome-headless:73
```

In your `.platform.app.yaml`:

```yaml
relationships:
  headless: "headless:http"
```

After configuration, include Puppeteer as a dependency in your `package.json`:

```json
"puppeteer": "^1.14.0"
```

Using the [Node.js Config Reader](https://github.com/platformsh/config-reader-nodejs) library and Puppeteer, you can define credentials for connecting to headless Chrome using the `browserURL` parameter of `puppeteer.connect()`.

### Taking screenshots

You can create a `screenshots.js` that includes an async function for taking full page screenshots of a given url. In this case, the screenshot is saved to a predefined writable mount `screenshots/` and takes a screenshot of the entire web page (`fullPage: true`). You can find more of the options available in `page.screenshot()` in the [Puppeteer documentation](https://pptr.dev/#?product=Puppeteer&version=v1.17.0&show=api-pagescreenshotoptions).

```
const puppeteer = require('puppeteer');
const platformsh = require('platformsh-config');

// Define a Config object and get credentials for chrome-headless
let config = platformsh.config();
const credentials = config.credentials('headless');

var exports = module.exports = {};

// Create an async function
exports.takeScreenshot = async function (url, screenshotID) {

    try {
        // Connect to chrome-headless using pre-formatted puppeteer credentials
        const formattedURL = config.formattedCredentials("headless", "puppeteer");
        const browser = await puppeteer.connect({browserURL: formattedURL});

        // Open a new page to the given url and take the screenshot
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({
            fullPage: true,
            path: `screenshots/${screenshotID}.png`
        });

        await browser.close();

        return browser

    } catch (e) {
        return Promise.reject(e);
    }

};
```

You can remove `fullPage`, which defaults to `false`, and Puppeteer will only take a screenshot of the default window size. Additionally, you can emulate how your application will appear on mobile devices by including the following after defining a new page

```
        const page = await browser.newPage();
        await page.emulate(devices['iPhone 6']);
        await page.goto(url);
```

and requiring Puppeteer's `DeviceDescriptors` module

```
const devices = require('puppeteer/DeviceDescriptors');
```

While this example emulates an iPhone 6 display, many more [device descriptors](https://pptr.dev/#?product=Puppeteer&version=v1.17.0&show=api-pageemulateoptions) are also available.

### Generating PDFs

You can also create a `pdfs.js` that includes an async function that will generate a PDF of a given URL. 

```
const puppeteer = require('puppeteer');
const platformsh = require('platformsh-config');

// Define a Config object and get credentials for chrome-headless
let config = platformsh.config();
const credentials = config.credentials('headless');

var exports = module.exports = {};

// Create an async function
exports.makePDF = async function (url, pdfID) {

    try {
        // Connect to chrome-headless using pre-formatted puppeteer credentials
        const formattedURL = config.formattedCredentials("headless", "puppeteer");
        const browser = await puppeteer.connect({browserURL: formattedURL});

        // Open a new page to the given url and create the PDF
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2'});
        await page.pdf({
            path: `pdfs/${pdfID}.pdf`,
            format: 'letter',
            printBackground: true
        });
        await browser.close();

        return browser

    } catch (e) {

        return Promise.reject(e);

    }

};
```

In this case, the PDF is saved to the predefined writable mount `pdfs/` and the generated file will include all background images on the site (`printBackground: true`). You can find more of the options available in `page.pdf()` in the [Puppeteer documentation](https://pptr.dev/#?product=Puppeteer&version=v1.17.0&show=api-pagepdfoptions).

