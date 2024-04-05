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

{{< image-versions image="chrome-headless" status="supported" environment="grid" >}}

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
CHROMEHEADLESS_SERVICE=chromeheadless
CHROMEHEADLESS_IP=123.456.78.90
CHROMEHEADLESS_HOSTNAME=azertyuiopqsdfghjklm.chromeheadless.service._.eu-1.{{< vendor/urlraw "hostname" >}}
CHROMEHEADLESS_CLUSTER=azertyuiop-main-7rqtwti
CHROMEHEADLESS_HOST=chromeheadless.internal
CHROMEHEADLESS_REL=http
CHROMEHEADLESS_SCHEME=http
CHROMEHEADLESS_TYPE=chrome-headless:{{< latest "chrome-headless" >}}
CHROMEHEADLESS_PORT=9222
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
    "service": "chromeheadless",
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.chromeheadless.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "cluster": "azertyuiop-main-7rqtwti",
    "host": "chromeheadless.internal",
    "rel": "http",
    "scheme": "http",
    "type": "chrome-headless:{{< latest "chrome-headless" >}}",
    "port": 9222
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_HEADLESSCHROME_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.chromeheadless[0].host')"
```

{{< /codetabs >}}

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

Configuration for a project looks similar to the following:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "/"
            type: "nodejs:{{% latest "nodejs" %}}"

            [...]

            # Relationships enable an app container's access to a service.
            relationships:
                chromeheadless: 
                    service: chromeheadless
                    endpoint: http
services:
    # The name of the service container. Must be unique within a project.
    chromeheadless:
        type: chrome-headless:{{% latest "chrome-headless" %}}
```

{{% v2connect2app serviceName="chromeheadless" relationship="chromeheadless" var="CHROME_BASEURL"%}}

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials,
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export CHROME_IP=${CHROMEHEADLESS_IP}
export CHROME_PORT=${CHROMEHEADLESS_PORT}

# Combine into a single base URL to be used within app.
export CHROME_BASEURL="http://${CHROME_IP}:${CHROME_PORT}"
```

{{% /v2connect2app %}}

Puppeteer allows your application to [create screenshots](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagescreenshotoptions), [emulate a mobile device](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pageemulateoptions), [generate PDFs](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagepdfoptions), and much more.

