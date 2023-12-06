---
title: "Headless Chrome"
weight: -90
description: |
  Headless Chrome is a headless browser that can be configured on projects like any other service on {{% vendor/name %}}.
---

{{% description %}}

You can interact with the `chrome-headless` service container using Puppeteer, a Node.js library that provides an API to control Chrome over the DevTools Protocol.

Puppeteer can be used to generate PDFs and screenshots of web pages, automate form submission, and test your project's UI. You can find out more information about using Puppeteer on [GitHub](https://github.com/GoogleChrome/puppeteer) or in their [documentation](https://pptr.dev/).

## Supported versions

{{% major-minor-versions-note %}}

{{% version/specific %}}
<!-- Platform.sh -->

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="chrome-headless" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="chrome-headless" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="chrome-headless" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

<--->
<!-- Upsun -->

{{< image-versions image="chrome-headless" status="supported" environment="grid" >}}

{{% /version/specific %}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "service": "chrome-headless",
    "ip": "169.254.91.5",
    "hostname": "gvbo7vktgmou2mplnzt4b54hgi.chrome-headless.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "chrome-headless.internal",
    "rel": "http",
    "scheme": "http",
    "type": "chrome-headless:{{< latest "chrome-headless" >}}",
    "port": 9222
}
```

## Requirements

Puppeteer requires at least Node.js version 6.4.0, while using the async and await examples below requires Node 7.6.0 or greater.

If your app container uses a language other than Node.js, upgrade the Node.js version before using Puppeteer.
See how to [manage your Node.js version](../languages/nodejs/node-version.md).

## Usage example

{{% endpoint-description type="chrome-headless" /%}}

After configuration, include [Puppeteer](https://www.npmjs.com/package/puppeteer) as a dependency:

{{< codetabs >}}

+++
title=npm
+++

```bash
npm install puppeteer
```

<--->

+++
title=pnpm
+++

```bash
pnpm add puppeteer
```

<--->

+++
title=Yarn
+++

```bash
yarn add puppeteer
```

<--->

{{< /codetabs >}}

{{% version/specific %}}
<!-- Platform.sh -->

Using the [Node.js Config Reader library](../development/variables/use-variables.md#access-variables-in-your-app), you can retrieve formatted credentials for connecting to headless Chrome with Puppeteer:

```js
const platformsh = require('platformsh-config');

const config = platformsh.config();
const credentials = config.credentials('chrome-headless');
```

and use them to define the `browserURL` parameter of `puppeteer.connect()` within an `async` function:

```js
exports.getBrowser = async function (url) {
    try {
        // Connect to chrome-headless using pre-formatted puppeteer credentials
        const formattedURL = config.formattedCredentials('chrome-headless', 'puppeteer');
        const browser = await puppeteer.connect({browserURL: formattedURL});

        ...

        return browser

    } catch (error) {
        console.error({ error }, 'Something happened!');
        browser.close();
    }
};
```

<--->
<!-- Upsun -->

Configuration for a project looks similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
type: "nodejs:{{% latest "nodejs" %}}"

# Other options...

# Relationships enable an app container's access to a service.
# The example below shows simplified configuration leveraging a default service (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
    chrome-headless: 
{{< /snippet >}}
{{< snippet name="chrome-headless" config="service" placeholder="true" >}}
    type: chrome-headless:{{% latest "chrome-headless" %}}
{{< /snippet >}}
```

{{< v2connect2app serviceName="chrome-headless" relationship="chrome-headless" var="CHROME_BASEURL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export CHROME_IP=$(echo $RELATIONSHIPS_JSON | jq -r ".chrome-headless[0].ip")
export CHROME_PORT=$(echo $RELATIONSHIPS_JSON | jq -r ".chrome-headless[0].port")

# Combine into a single base URL to be used within app.
export CHROME_BASEURL="http://${CHROME_IP}:${CHROME_PORT}"
```

{{< /v2connect2app >}}

{{% /version/specific %}}

Puppeteer allows your application to [create screenshots](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagescreenshotoptions), [emulate a mobile device](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pageemulateoptions), [generate PDFs](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagepdfoptions), and much more.

{{% version/specific %}}
<!-- Platform.sh -->

You can find some useful examples of using headless Chrome and Puppeteer on {{< vendor/name >}} on the Community Portal:

* [How to take screenshots using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-take-screenshots-using-puppeteer-and-headless-chrome/305)
* [How to generate PDFs using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-generate-pdfs-using-puppeteer-and-headless-chrome/306)


<--->
<!-- Upsun -->

{{% /version/specific %}}
