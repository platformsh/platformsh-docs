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
| **Manual configuration / setup burden**               | Lower: using a supported runtime means less manual setup; adding downloads, dependencies, and spackages might require use of build hooks, which might complicate configuration.                                          | Higher: you manually define the composition of the container or  `stack` (runtimes + packages) of Nix packages. More flexible but requires more setup.  |
| **Maintenance & updates (patches, upgrades)**         | {{% vendor/company_name %}} handles image updates (minor and patch updates; security patches) automatically on deployment                                                                      | You need to redeploy often to apply Nix package updates; update cadence depends on package maintainers.                           |
| **Flexibility (versions, custom binaries, tools)**    | Limited to supported runtimes + permitted extensions. If you require combinations not supported by Upsun, you may hit limits (e.g. certain PHP + Node.js/Python combos).  | High — you can mix runtimes, pick specific package versions, and include custom binaries/tools via Nix.                            |
| **When to reconsider / migrate**                      | If you need many packages (beyond runtime extensions), complex dependencies, multiple runtimes, or custom tools, consider migrating to composable.          | If you don’t need the complexity (just a simple runtime and minimal packages), composable may be unnecessary overhead.                                                   |

**Single-runtime image**: Use this image type for applications that require a {{% vendor/company_name %}}-supported single-runtime image and don't need any extra extensions beyond what that runtime image already includes.

Consider using a single-runtime image when these factors are important:
- Your application requires only a single runtime and no (or few) additional packages or tools.<BR>
    You can add runtime extensions, but packages that are not related to the runtime can only be added to the build phase, which involves a common line installation. As a result, you might need to make additional changes to the configuration file to establish a valid configuration.<BR>
    If you anticipate adding many packages or having a complex build hook, consider using a composable image instead.
- You want to choose specific package versions (for example, a specific PHP version).

    **Note:** For any supported PHP version, only specific node.js and Python versions are available in a single-runtime image. If your application requires combinations that {{% vendor/name %}} does not support, consider using a composable image, which enables you to combine different versions.
- You want {{% vendor/name %}} to update the image (perform package upgrades and apply security patches) rather than do this maintenance yourself.
- Your team has the time and knowledge to manually configure package versions and manage dependencies: For example, writing scripts to cache binaries after they're downloaded.

If you initially choose a single-runtime image and your application needs change, you can move the app to a composable image: For example, if you determine that your application needs additional packages or multiple runtimes.

**Composable image**: Choose this image type your application has multiple dependencies: for example, multiple runtimes, additional packages, or other items such as HTML files or PDF images.

This image type enables you to build an image by using the packages in the latest available Nix channel, or you can define ("compose") the collection of packages (as defined by the `stack` key) for your image, especially when packages are available in the {{% vendor/name %}} registry.

Manually defining a stack in a composable image is typically simpler than adding packages to a build hook to support a single-runtime image.

Consider using a composable image when these factors are important:
- Your application requires multiple runtimes and tools, or different versions of the same package.
- You want the ability to install _all_ the packages you need in your application container, ensuring that an application works on any machine.<BR>
    In a composable image, you can accomplish this by using supported Nix channels. This method ensures app consistency and helps to streamline the development, testing, and deployment processes.

- Your team is comfortable with upgrading, testing, and refactoring images promptly when Nix a channel becomes deprecated (every six months).



## Keys used in each image type {#keys-used-in-each-image-type}

Both image types use many of the same keys. Differences in syntax or meaning are noted as needed - see the [Image properties](/create-apps/image-properties.md) section for the topics that describe each key.

Defining your app's tech stack depends on on the image type you choose:
- Single-runtime image: Use the
[``build``](/create-apps/app-reference/single-runtime-image.md#build), [``dependencies``](/create-apps/app-reference/single-runtime-image.md#dependencies), and [``runtime``](/create-apps/app-reference/single-runtime-image.md#runtime) keys 
- Composable image: In the [`stack`](/create-apps/app-reference/composable-image.md#stack) key, define the ``runtimes`` and ``packages`` that your app requires.

## Multi-app projects
In a multiple application context, you can use a mix of single-runtime images and composable images. See the examples in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md#combine-single-runtime-and-composable-images) topic and [composable](/create-apps/app-reference/composable-image.md#combine-single-runtime-and-composable-images) image topic.




