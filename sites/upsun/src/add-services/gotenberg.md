---
title: "Gotenberg"
weight: -95
description: Gotenberg is a user-friendly API for PDF files.
---

Gotenberg is a stateless API for converting various document formats into PDF files.
For more information, see the [Gotenberg documentation](https://gotenberg.dev/docs/getting-started/introduction).

## Supported versions

- 8

You can select the major version. But the latest compatible minor version is applied automatically and can’t be overridden.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

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
GOTENBERG_INSTANCE_IPS=["249.45.240.83"]
GOTENBERG_SCHEME=http
GOTENBERG_HOSTNAME=rssjaxyeoorjje6axcq35xu5gq.gotenberg.service._.eu-5.{{< vendor/urlraw "hostname" >}} >}}
GOTENBERG_SERVICE=gotenberg
GOTENBERG_CLUSTER=p2f2xrzyq7a6k-main-bvxea6i
GOTENBERG_IP=169.254.137.3
GOTENBERG_TYPE=gotenberg:8
GOTENBERG_HOST=gotenberg.internal
GOTENBERG_PORT=3000
GOTENBERG_REL=http
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
  "host": "gotenberg.internal",
  "hostname": "rssjaxyeoorjje6axcq35xu5gq.gotenberg.service._.eu-5.{{< vendor/urlraw "hostname" >}}",
  "cluster": "p2f2xrzyq7a6k-main-bvxea6i",
  "service": "gotenberg",
  "rel": "http",
  "scheme": "http",
  "port": "3000",
  "type": "gotenberg:8",
  "instance_ips": [
    "249.45.240.83"
  ],
  "ip": "169.254.137.3",
  "url": "http://gotenberg.internal:3000"
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information
in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_GOTENBERG_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.gotenberg[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the `gotenberg` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: gotenberg:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the ``http`` endpoint:


{{< codetabs >}}

+++
title=Using default endpoints
+++
```yaml {configFile="app"}
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
You can define ``<SERVICE_NAME>`` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.
<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
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

{{< /codetabs >}}

With the above definition, {{% vendor/name %}} uses the `http` endpoint,
providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships) (the network address a service is accessible from) that is identical to the _name_ of that service.

The `http` endpoint uses port `3000` by default.

### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++
```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      gotenberg:
services:
  # The name of the service container. Must be unique within a project.
  gotenberg:
    type: gotenberg:8
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      gotenberg:
        service: gotenberg
        endpoint: http
services:
  # The name of the service container. Must be unique within a project.
  gotenberg:
    type: gotenberg:8
```

{{< /codetabs >}}


## Generate a PDF using Gotenberg

As an example, to generate a PDF file of the {{% vendor/name %}} website, run the following cURL command:

```bash {location="Terminal"}
curl \
--request POST http://yduimhaby523ase4lju3qhimre.gotenberg8.service._.eu-3.{{< vendor/urlraw "hostname" >}}/forms/chromium/convert/url \
--form url=https://upsun.com \
--form landscape=true \
--form marginTop=1 \
--form marginBottom=1 \
-o my.pdf
```
