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

You can select the major version. But the latest compatible minor version is applied automatically and can’t be overridden.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

{{< image-versions image="chrome-headless" status="supported" environment="grid" >}}

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

```bash
CHROME_HEADLESS_SERVICE=chrome-headless
CHROME_HEADLESS_IP=123.456.78.90
CHROME_HEADLESS_HOSTNAME=azertyuiopqsdfghjklm.chrome-headless.service._.eu-1.{{< vendor/urlraw "hostname" >}}
CHROME_HEADLESS_CLUSTER=azertyuiop-main-7rqtwti
CHROME_HEADLESS_HOST=chrome-headless.internal
CHROME_HEADLESS_REL=http
CHROME_HEADLESS_SCHEME=http
CHROME_HEADLESS_TYPE=chrome-headless:{{< latest "chrome-headless" >}}
CHROME_HEADLESS_PORT=9222
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

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

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_HEADLESSCHROME_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.chrome-headless[0].host')"
```

{{< /codetabs >}}

## Requirements

Puppeteer requires at least Node.js version 6.4.0, while using the async and await examples below requires Node 7.6.0 or greater.

If your app container uses a language other than Node.js, upgrade the Node.js version before using Puppeteer.
See how to [manage your Node.js version](../languages/nodejs/node-version.md).

## Usage example

### 1. Configure the service

To define the service, use the `chrome-headless` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: chrome-headless:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /codetabs >}}

### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      chrome-headless:
services:
  # The name of the service container. Must be unique within a project.
  chrome-headless:
    type: chrome-headless:{{% latest "chrome-headless" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      chrome-headless:
        service: chrome-headless
        endpoint: http
services:
  # The name of the service container. Must be unique within a project.
  chrome-headless:
    type: chrome-headless:{{% latest "chrome-headless" %}}
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

Configuration for a project looks similar to the following:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"
      type: "nodejs:{{% latest "nodejs" %}}"

      [...]

      # Relationships enable access from this app to a given service.
      # The example below shows simplified configuration leveraging a default service
      # (identified from the relationship name) and a default endpoint.
      # See the Application reference for all options for defining relationships and endpoints.
      relationships:
        chrome-headless:
services:
  # The name of the service container. Must be unique within a project.
  chrome-headless:
    type: chrome-headless:{{% latest "chrome-headless" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"
      type: "nodejs:{{% latest "nodejs" %}}"

      [...]

      # Relationships enable access from this app to a given service.
      # The example below shows configuration with an explicitly set service name and endpoint.
      # See the Application reference for all options for defining relationships and endpoints.
      relationships:
        chrome-headless:
          service: chrome-headless
          endpoint: http
services:
  # The name of the service container. Must be unique within a project.
  chrome-headless:
    type: chrome-headless:{{% latest "chrome-headless" %}}
```

{{< /codetabs >}}


This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `chrome-headless` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, `myapp` can retrieve access credentials to the service through the [relationship environment variable](/add-services/elasticsearch.md#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials,
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export CHROME_IP=${CHROME_HEADLESS_IP}
export CHROME_PORT=${CHROME_HEADLESS_PORT}

# Combine into a single base URL to be used within app.
export CHROME_BASEURL="http://${CHROME_IP}:${CHROME_PORT}"
```

The above file &mdash; `.environment` in the `myapp` directory &mdash; is automatically sourced by {{< vendor/name >}} into the runtime environment, so that the variable `CHROME_BASEURL` can be used within the application to connect to the service.

Note that `CHROME_BASEURL` and all {{< vendor/name >}} [service environment variables](/development/variables.html#service-environment-variables) like `CHROME_HEADLESS_HOST`, are environment-dependent. Unlike the build produced for a given commit, they can't be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the `{{< vendor/cli >}} ify` command to [migrate a codebase to {{% vendor/name %}}](/get-started).

Puppeteer allows your application to [create screenshots](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagescreenshotoptions), [emulate a mobile device](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pageemulateoptions), [generate PDFs](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-pagepdfoptions), and much more.
