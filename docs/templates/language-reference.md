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
  4. Replace all instances of "<LANGUAGE_NAME>" in the examples with the language's name.
-->

A brief introduction (1--2 sentences) to the language.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="dedicated" >}} | {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="dedicated-gen-3" >}} |

<!-- If there are any deprecated versions. -->
{{% deprecated-versions %}}

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="grid" >}} | {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="dedicated" >}} | {{< image-versions image="<LANGUAGE_NAME>" status="supported" environment="dedicated-gen-3" >}} |

## Usage example

At least a minimal example of how to add the language to `.app.platform.yaml`.
Ideally, also with a full working example that shows it in context.

## Modules/dependencies

Depending on the language, a brief description of the recommended way to handle dependencies in the language.

## Connecting to services

If available, include examples for connecting in an app
(taken from https://examples.docs.platform.sh/).

### Configuration reader

If available, include the configuration reader available for the given language
(for example, for [Python](https://github.com/platformsh/config-reader-python)).

## Any other functions specific to the language

Structure like [how to steps](./how-to.md#1-do-this-step-first).
Split each function 

## Project templates

A description of what templates are.

{{< repolist lang="<LANGUAGE_NAME>" >}}
