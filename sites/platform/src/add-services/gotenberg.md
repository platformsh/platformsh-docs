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

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

```json
{
  "host": "gotenberg.internal",
  "hostname": "azertyuiopqsdfghjklm.gotenberg.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiopqsdf-main-7rqtwti",
  "service": "gotenberg",
  "rel": "http",
  "scheme": "http",
  "port": "3000",
  "type": "gotenberg:8",
  "instance_ips": [
    "123.456.78.90"
  ],
  "ip": "123.456.78.90",
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

## Usage example

### 1. Configure the service

To define the service, use the `gotenberg` type:

```yaml {configFile="services"}
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
name: myapp
# Relationships enable access from this app to a given service.
relationships:
  <SERVICE_NAME>:
```

You can define ``<SERVICE_NAME>`` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.

With the above definition, {{% vendor/name %}} uses the `http` endpoint,
providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships) (the network address a service is accessible from) that is identical to the _name_ of the service.

The application has access to the service via this relationship and its corresponding `PLATFORM_RELATIONSHIPS` [environment variable](/development/variables/use-variables.md#use-provided-variables).

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

With the above definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

The `http` endpoint uses port `3000` by default.

### Example configuration

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
gotenberg:
  type: gotenberg:8
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
relationships:
  gotenberg:
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
  gotenberg:
    service: gotenberg
    endpoint: http
```

{{< /codetabs >}}

## Generate a PDF using Gotenberg

As an example, to generate a PDF file of the {{% vendor/name %}} website, run the following cURL command:

```bash {location="Terminal"}
curl \
--request POST http://yduimhaby523ase4lju3qhimre.gotenberg8.service._.eu-3.{{< vendor/urlraw "hostname" >}}/forms/chromium/convert/url \
--form url=https://platform.sh \
--form landscape=true \
--form marginTop=1 \
--form marginBottom=1 \
-o my.pdf
```
