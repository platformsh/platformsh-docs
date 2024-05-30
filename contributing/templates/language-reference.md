---
title: Language name
description: A short description (up to ~160 characters) of the language that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  For all available languages: https://docs.platform.sh/languages.html

How to use
  1. Copy this template into /src/docs/languages/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
  4. Replace all instances of "<LANGUAGE_TYPE>" in the examples with the language's code name (such as "nodejs").
  5. Replace all instances of "<LANGUAGE_NAME>" in the examples with the language's name (such as "Node.js").
-->

A brief introduction (1--2 sentences) to the language.

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="<LANGUAGE_TYPE>" status="supported" environment="grid" >}} | {{< image-versions image="<LANGUAGE_TYPE>" status="supported" environment="dedicated-gen-2" >}} |

{{% language-specification type="<LANGUAGE_TYPE>" display_name="<LANGUAGE_NAME>" %}}

<!-- If there are any deprecated versions. -->
{{% deprecated-versions %}}

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="<LANGUAGE_TYPE>" status="supported" environment="grid" >}} | {{< image-versions image="<LANGUAGE_TYPE>" status="supported" environment="dedicated-gen-2" >}} |

## Usage example

At least a minimal example of how to add the language to `.app.platform.yaml`.
Ideally, also with a full working example that shows it in context.

## Modules/dependencies

Depending on the language, a brief description of the recommended way to handle dependencies in the language.

## Connect to services

If available, include examples for connecting to different services in an app
(taken from https://examples.docs.platform.sh/).

The following examples show how to use <LANGUAGE_NAME> to access various [services](/add-services/_index.md).
To configure a given service, see the page dedicated to that service.

{{< codetabs >}}

+++
title=<SERVICE_NAME>
file=static/files/fetch/examples/<LANGUAGE_TYPE>/<SERVICE_TYPE>
highlight=<LANGUAGE_NAME>
markdownify: false
---

<--->

+++
title=<DIFFERENT_SERVICE_NAME>
file=static/files/fetch/examples/<LANGUAGE_TYPE>/<DIFFERENT_SERVICE_TYPE>
highlight=<LANGUAGE_NAME>
markdownify: false
---

{{< /codetabs >}}

{{% config-reader %}}
[`<CONFIG_READER_NAME>`](<CONFIG_READER_REPOSITORY_URL>)
{{% /config-reader %}}

<!-- 
For Node.js, that would result in the following:
{{% config-reader %}}
[platformshconfig](https://github.com/platformsh/config-reader-nodejs).
{{% /config-reader %}}
-->

## Any other functions specific to the language

Structure like [how to steps](./how-to.md#1-do-this-step-first).
Split each function.

## Project templates

{{< repolist lang="<LANGUAGE_TYPE>" displayName="<LANGUAGE_NAME>" >}}
