---
title: "App reference"
weight: 4
description: Configure your app and control how it's built and deployed on {{% vendor/name %}}.
layout: single
---

To define your app, you can either use one of {{% vendor/name %}}'s [single-runtime image](/create-apps/app-reference/single-runtime-image.md)
or its [composable image (BETA)](/create-apps/app-reference/composable-image.md).

## Single-runtime image

{{% vendor/name %}} provides and maintains a list of single-runtime images you can use for each of your application containers.</br>
See [all of the options you can use](/create-apps/app-reference/single-runtime-image.md) to define your app using a single-runtime image.

## Composable image (BETA)

The {{% vendor/name %}} composable image provides more flexibility than single-runtime images.
When using a composable image, you can define a stack (or group of packages) for your application container to use.

There are over 80,000 packages available from the [Nix Packages collection](https://search.nixos.org/) that you can add to your stack.
You can add as many packages to your application container as you need.

{{% note %}}

{{% vendor/name %}} guarantees optimal user experience with the specific [set of packages](/create-apps/app-reference/composable-image.md#supported-nix-packages) it supports.
You can use any other package available from the [Nix Packages collection](https://search.nixos.org/), including unstable ones,
but NixOs is responsible for their support.

{{% /note %}}

See [all of the options you can use](/create-apps/app-reference/composable-image.md) to define your app using the composable image.
