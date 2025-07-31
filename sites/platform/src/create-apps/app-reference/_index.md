---
title: "Choose an image type"
weight: -19
description: Configure your app and control how it's built and deployed on {{% vendor/name %}}.
layout: single
---

<!-- 
Jul20205 WORK IN PROGRESS 
The point of this topic is to help the user to decide which type to choose
- rework this topic make it clear when you choose one instead of the other (a table, if possible)
- add "image" definition here and also in the glossary
- link to use cases
- mention the level of support for both types
-->

An _image_ represents the configuration for the container that contains the application (or service) that you want to deploy. 

When 

Single-runtime image type: 
- Can contain only a single runtime
- Requires more manual configuration the composable images, but are more flexible
- Initial build takes
- `type` defines your image version (for example, `php:8.4`)
- You can move to a composable image later, if your application needs change

Composable image type has these characteristics: 
- Can contain multiple runtimes
- Requires less manual configuration than single-runtime images and offers more flexibility in other ways
- Initial build and rebuilds and can take a long time,<!-- a few minutes? --> but caching increases the speed <!-- clarify this -->
- `type` defines your Nix channel
- Can be used for applications only, not services <!-- what about workers? -->


<!-- add a feature/comparison table, if appropriate - easier to read for user 
| Feature              | Single-runtime image | Composable image | 
|----------------------|----------------------|------------------|
|   Support            |                      |                  | 
|   `type`             |                      |                  | 
|                  |                      |                  | 

-->

<!-- JUL20205 kept the original content below for now -->
To define your app, you can either use one of {{% vendor/name %}}'s [single-runtime image](/create-apps/app-reference/single-runtime-image.md)
or its [composable image (BETA)](/create-apps/app-reference/composable-image.md).

## Single-runtime image

{{% vendor/name %}} provides and maintains a list of single-runtime images you can use for each of your application containers.</br>
See [all of the options you can use](/create-apps/app-reference/single-runtime-image.md) to define your app using a single-runtime image.

## Composable image (BETA)

The {{% vendor/name %}} composable image provides more flexibility than single-runtime images. This image type enables you to define or "compose" the stack (or group of packages) to include in the container that runs your application. 

Composable images can be used for applications only, not for services. This image type enables you to install multiple runtimes (such as PHP, Ruby, and so on) as well aXXX in your application container.

<!-- orig sentence below, now in included in first para 
When using a composable image, you can define a stack (or group of packages) for your application container to use. 
-->

There are over 120,000 packages available from the [Nix Packages collection](https://search.nixos.org/) that you can add to your stack.
You can add as many packages to your application container as you need.

{{% note %}}

{{% vendor/name %}} guarantees optimal user experience with the specific [set of packages](/create-apps/app-reference/composable-image.md#supported-nix-packages) it supports.
You can use any other package available from the [Nix Packages collection](https://search.nixos.org/), including unstable ones,
but NixOs is responsible for their support.

{{% /note %}}

See [all of the options you can use](/create-apps/app-reference/composable-image.md) to define your app using the composable image.
