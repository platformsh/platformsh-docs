---
title: "App reference"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

{{% description %}}

There is two choice on how to define your apps, either using [built-in image](/create-apps/app-reference/builtin-image.md) or [Composable Image (BETA)](/create-apps/app-reference/composable-image.md).

## Built-in image
{{% vendor/name %}} is providing and maintaining a list of runtime images that you can use for each of your application containers,

Limitation is that you can set only on runtime per application container.

## Composable Image (BETA)
{{% vendor/name %}} allow you to define a Stack (group of packages) that your application container will use, based on more than 80'000 available [NixOs packages](https://search.nixos.org/) (even the unstable ones),
and you can add as many packages as needed by your application within the same application container.

Limitation is that {{% vendor/name %}} only maintains a [set of packages](/create-apps/app-reference/composable-image.md#stack) and won't support other packages.
Other packages support is NixOs' duty.

## More information
