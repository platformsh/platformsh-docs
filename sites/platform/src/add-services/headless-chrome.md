---
title: "Headless Chrome"
weight: -90
description: |
  Headless Chrome is a headless browser that can be configured on projects like any other service on {{% vendor/name %}}.
---

Headless Chrome is a headless browser that can be configured on projects like any other service on {{% vendor/name %}}.

You can interact with the `chrome-headless` service container using Puppeteer, a Node.js library that provides an API to control Chrome over the DevTools Protocol.

Puppeteer can be used to generate PDFs and screenshots of web pages, automate form submission, and test your project's UI. You can find out more information about using Puppeteer on [GitHub](https://github.com/GoogleChrome/puppeteer) or in their [documentation](https://pptr.dev/).

## Supported versions

You can select the major version. But the latest compatible minor version is applied automatically and can’t be overridden.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

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

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "service": "chrome-headless",
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.chrome-headless.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiop-main-7rqtwti",
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

### 1. Configure the service

To define the service, use the `chrome-headless` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: chrome-headless:<VERSION>
  disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  <SERVICE_NAME>:
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: http
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
chrome-headless:
    type: chrome-headless:{{% latest "chrome-headless" %}}
```

#### [App configuration](/create-apps)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  chrome-headless:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  chrome-headless:
    service: chrome-headless
    endpoint: http
```

{{< /codetabs >}}

### Use in app

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

Using the [Node.js Config Reader library](../development/variables/use-variables.md#access-variables-in-your-app), you can retrieve formatted credentials for connecting to headless Chrome with Puppeteer:

```js
const platformsh = require('platformsh-config');

const config = platformsh.config();
const credentials = config.credentials('chromeheadless');
```

and use them to define the `browserURL` parameter of `puppeteer.connect()` within an `async` function:

```js
exports.getBrowser = async function (url) {
  try {
    // Connect to chrome-headless using pre-formatted puppeteer credentials
    const formattedURL = config.formattedCredentials('chromeheadless', 'puppeteer');
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

You can find some useful examples of using headless Chrome and Puppeteer on {{< vendor/name >}} on the Community Portal:

* [How to take screenshots using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-take-screenshots-using-puppeteer-and-headless-chrome/305)
* [How to generate PDFs using Puppeteer and Headless Chrome](https://community.platform.sh/t/how-to-generate-pdfs-using-puppeteer-and-headless-chrome/306)
