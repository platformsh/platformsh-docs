---
title: Service name
description: A short description (up to ~160 characters) of the service that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  For all available services: https://docs.platform.sh/add-services.html

How to use
  1. Copy this template into /src/docs/add-services/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
  4. Replace all instances of "<SERVICE_NAME>" in the examples with the service's name.
-->

A brief introduction (1--2 sentences) to what this service is used for.

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="<SERVICE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-2" >}} |

<!-- If there are any deprecated versions. -->
{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="<SERVICE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-2" >}} |

## Usage example

<!--
  Include the general template for usage examples.
  Replace `<SERVICE_TYPE>` with the type.

  If the service allows multiple endpoints, also include following parameter:
  sectionLink="#<SECTION_ON_PAGE_WITH_DESCRIPTION>" multipleText="<NOUN_THAT_CAN_BE_MULTIPLE"
  Example for MariaDB:
  sectionLink="#multiple-databases" multipleText="databases" 

  If the service doesn't have examples of usage in an app taken from https://examples.docs.platform.sh/
  include the following parameter:
  noApp=true
-->
{{% endpoint-description type="<SERVICE_TYPE>" /%}}

{{< codetabs >}}

+++
title=<LANGUAGE>
file=static/files/fetch/examples/<LANGUAGE_NAME>/<SERVICE_TYPE>
highlight=<LANGUAGE>
---

<--->
<!-- Repeat above for more languages -->
{{< /codetabs >}}

<!-- If the service has options in the `configuration` key -->
## Configuration options

You can configure your <SERVICE_NAME> service in the [services configuration](#1-configure-the-service) with the following options:

| Name   | Type     | Required | Description   |
|--------|----------|----------|---------------|
| `type` | `string` | Yes      | What it does. |

<!-- An introduction to the relationship reference -->
{{% relationship-ref-intro %}}

<!-- A generic reminder to use the variable and not hard code things -->
{{% service-values-change %}}

<!-- A yaml file taken from https://examples.docs.platform.sh/ that contains all the properties people need to access/use the service. -->
{{< relationship "<SERVICE_NAME>" >}}

## Any other functions specific to the service

Structure like [how to steps](./how-to.md#1-do-this-step-first).
Split each function into a separate section.
