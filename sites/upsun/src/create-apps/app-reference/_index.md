---
title: "Choose an image type"
weight: -19
description: Configure your app and control how it's built and deployed on {{% vendor/name %}}.
layout: single
---

An _image_ represents the configuration of the container that contains the application (or service) that you want to deploy.

Choosing the image type for the container that best suits your application is the first and most important decision in configuring how your application is deployed.

You can choose either {{% vendor/name %}}'s [single-runtime image](/create-apps/app-reference/single-runtime-image.md)
or its [composable image](/create-apps/app-reference/composable-image.md). **The key difference between them is the type of flexibility that they offer**.

For both image types, the image is defined in the `{{< vendor/configfile "app" >}}` file.

## Which image type should you choose? {#which-image-type}

| **Criteria / Use‑case**                               | **Single‑runtime image**                                                                                                                                                                                       | **Composable image**                                                                                                                                                     |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **When it’s best used (typical use case)**            | Good for simple applications that need only one runtime.                                                                                                                | Best for applications needing custom secondary runtimes, static assets, or custom binaries/tools.                                  |
| **# of runtimes per container**                       | One — a single runtime per container.                                                                                                                                    | Zero or more — you can define multiple runtimes (or none) per container.                                                           |
| **Packages permitted / how dependencies are managed** | Only the base runtime and its extensions are permitted directly. To add non-runtime packages, you must use build-phase installation via hooks or dependencies. See [Keys used](#keys-used-in-each-image-type) below.      | Supports multiple runtimes, extensions, packages and services. You define everything in the `stack` key (runtimes + Nix packages). See [Keys used](#keys-used-in-each-image-type) below.           |
| **Manual configuration / setup burden**               | Lower: using a supported runtime means less manual setup; adding downloads, dependencies, and packages might require use of build hooks, which might complicate configuration.                                          | Higher: you manually define the composition of the container or  `stack` (runtimes + packages) of Nix packages. More flexible but requires more setup.  |
| **Maintenance & updates (patches, upgrades)**         | {{% vendor/company_name %}} handles image updates (minor and patch updates; security patches) automatically on deployment                                                                      | You need to redeploy often to apply Nix package updates; update cadence depends on package maintainers.<BR>Your team must be comfortable with upgrading, testing, and refactoring images promptly when Nix a channel becomes deprecated (every six months).                          |
| **Flexibility (versions, custom binaries, tools)**    | Limited to supported runtimes + permitted extensions. If you require combinations not supported by Upsun, you may hit limits (e.g. certain PHP + Node.js/Python combos).  | High — you can mix runtimes, pick specific package versions, and include custom binaries/tools via Nix.                            |
| **When to reconsider / migrate**                      | If you need many packages (beyond runtime extensions), complex dependencies, multiple runtimes, or custom tools, consider migrating to composable.          | If you don’t need the complexity (just a simple runtime and minimal packages), composable may be unnecessary overhead.                                                   |

## Keys used in each image type {#keys-used-in-each-image-type}

Both image types use many of the same keys. Differences in syntax or meaning are noted as needed - see the [Image properties](/create-apps/image-properties.md) section for the topics that describe each key.

Defining your app's tech stack depends on the image type you choose:
- Single-runtime image: Use the
[``build``](/create-apps/app-reference/single-runtime-image.md#build), [``dependencies``](/create-apps/app-reference/single-runtime-image.md#dependencies), and [``runtime``](/create-apps/app-reference/single-runtime-image.md#runtime) keys 
- Composable image: Use the [``stack.runtimes`` and ``stack.packages``](/create-apps/app-reference/composable-image.md#stack) keys

## Multi-app projects
In a multiple application context, you can use a mix of single-runtime images and composable images. See the examples in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md#combine-single-runtime-and-composable-images) topic and [composable image](/create-apps/app-reference/composable-image.md#combine-single-runtime-and-composable-images) topic.
