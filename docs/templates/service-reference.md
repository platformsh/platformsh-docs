---
title: Service name
description: A short description (up to ~160 characters) of the service that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  For all available services: https://docs.platform.sh/configuration/services.html

How to use
  1. Copy this template into /src/docs/configuration/services/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
  4. Replace all instances of "<SERVICE_NAME>" in the examples with the service's name.
-->

A brief introduction (1--2 sentences) to what this service is used for.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="<SERVICE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-3" >}} |

<!-- If there are any deprecated versions. -->
{{% deprecated-versions %}}

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="<SERVICE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated" >}} | {{< image-versions image="<SERVICE_NAME>" status="supported" environment="dedicated-gen-3" >}} |

## Usage example

Short steps on how to add the service to `services.yaml` and `.app.platform.yaml`.
Can be structured like [how to steps](./how-to.md#1-do-this-step-first).

If available, include examples in various languages using the service in an app
(taken from https://examples.docs.platform.sh/).

## `$PLATFORM_RELATIONSHIPS` reference

<!-- A yaml file taken from https://examples.docs.platform.sh/ that contains all the properties people need to access/use the service. -->
{{< relationship "<SERVICE_NAME>" >}}

## Any other functions specific to the service

Structure like [how to steps](./how-to.md#1-do-this-step-first).
Split each function into a separate section.
