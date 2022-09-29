---
title: "Headless Chrome"
weight: 2
description: |
  Headless Chrome is a headless browser that can be configured on projects like any other service on Platform.sh.
---

{{% description %}}

You can interact with the `headless-chrome` service container using Puppeteer, a Node.js library that provides an API to control Chrome over the DevTools Protocol.

Puppeteer can be used to generate PDFs and screenshots of web pages, automate form submission, and test your project's UI. You can find out more information about using Puppeteer on [GitHub](https://github.com/GoogleChrome/puppeteer) or in their [documentation](https://pptr.dev/).

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="chrome-headless" status="supported" environment="grid" >}} | {{< image-versions image="chrome-headless" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="chrome-headless" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "chrome-headless" %}}

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

```yaml
{
    "service": "headless",
    "ip": "169.254.73.96",
    "hostname": "3rxha4e2w4yv36lqlypy7qlkza.headless.service._.eu-3.platformsh.site",
    "cluster": "moqwtrvgc63mo-main-7rqtwti",
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

If your app container uses a language other than Node.js, upgrade the Node.js version before using Puppeteer.
See how to [manage your Node.js version](../languages/nodejs/node-version.md).

## Usage example

{{% endpoint-description type="chrome-headless" /%}}

After configuration, include Puppeteer as a dependency:

```json {location="package.json"}
{
  "dependencies": {
    "puppeteer": "^13.0.1"
  }
}
```

Using the [Node.js Config Reader](https://github.com/platformsh/config-reader-nodejs) library, you can retrieve formatted credentials for connecting to headless Chrome with Puppeteer:

```js
const platformsh = require('platformsh-config');

const config = platformsh.config();
const credentials = config.credentials('chromeheadlessbrowser');
```

and use them to define the `browserURL` parameter of `puppeteer.connect()` within an `async` function:

```js
exports.getBrowser = async function (url) {
    try {
        // Connect to chrome-headless using pre-formatted puppeteer credentials
        const formattedURL = config.formattedCredentials('chromeheadlessbrowser', 'puppeteer');
        const browser = await puppeteer.connect({browserURL: formattedURL});

        ...

        return browser

    } catch (error) {
        console.error({ error }, 'Something happened!');
        browser.close();
    }
};
```

Puppeteer allows your application to [create screenshots](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagescreenshotoptions), [emulate a mobile device](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pageemulateoptions), [generate PDFs](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagepdfoptions), and much more.

You can find some useful examples of using headless Chrome and Puppeteer on Platform.sh on the Community Portal:

* [How to take screenshots using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-take-screenshots-using-puppeteer-and-headless-chrome/305)
* [How to generate PDFs using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-generate-pdfs-using-puppeteer-and-headless-chrome/306)
