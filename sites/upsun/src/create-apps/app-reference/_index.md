---
title: "Choose an image type"
weight: -19
description: Configure your app and control how it's built and deployed on {{% vendor/name %}}.
layout: single
---

An _image_ represents the configuration of the container that contains the application (or service) that you want to deploy. 

Choosing the image type for the container that best suits your application is the first and most important decision in configuring how your application is deployed.

You can choose either {{% vendor/name %}}'s [single-runtime image](/create-apps/app-reference/single-runtime-image.md)
or its [composable image (BETA)](/create-apps/app-reference/composable-image.md). **The key difference between them is the type of flexibility that they offer**. 

## Which image type should you choose? {#which-image-type}

**Single-runtime image**: This image type offers the flexibility to specify single runtime package versions, however, this typically requires more manual configuration.

Consider using a single-runtime image when these factors are important:
- Your application requires a single runtime only.
- You want the ability to choose specific package versions, including patches.
- You want {{% vendor/name %}} to update the image (perform package upgrades and apply security patches) rather do this maintenance yourself
- Your team has the time and knowledge to manually configure package versions and manage dependencies: For example, writing scripts to cache binaries after they're downloaded, or understanding upgrade paths for complicated node binary dependencies. <!-- the latter "...or understanding upgrade paths..." seems to contradict the vendor maintenance point? -->

If you initially choose a single-runtime image and your application needs change, you can move the app to a composable image if your app needs change. <!-- example of when? -->

**Composable image** (BETA): This image type offers the flexibility to define or "compose" the stack (group of packages) to include in the container that runs your application. Developers spend less time manually configuring stacks and dependencies because stacks are already defined in the supported Nix channels.

Consider using a composable image when these factors are important:
- Your application requires multiple runtimes and tools, or even different versions of the same package
- You want the ability to install _all_ the packages you need in your application container, ensuring consistency across environments and machines<!-- rather than ...? -->
- You or your teams have the time and skills to upgrade packages and apply security patches. <!-- delete? does this repeat the next bullet? -->
- You or your teams understand how to update a configured image when package versions change in supported stacks (for example, if a package version in Nix channel X.Y changes, you might need to update the versions of additonal packages defined in the stack)
- Consistency: Nix channels ensure that what works on your local machine works on any other machine. This consistency also streamlines development and testing.


| Criteria              | Single-runtime image | Composable image | 
|-----------------------------|----------------------|------------------|
| # of runtimes per container | one                  | one or more                    |
| Manual configuration        | Typically required for downloads, dependencies       | Typically needed only when Nix channel versions and other versions listed in the `stack` are incompatible | 
| Maintenance (upgrades and patches)  | Maintained by {{% vendor/name %}} | Maintained by you | 
|   Support                   |    XXX                 | Stable Nix channels only, but any NixOs package can be installed, including `unstable`                                    | 
|  config file                | `{{< vendor/configfile "app" >}}`  |   `{{< vendor/configfile "app" >}}`           | 
| XXX                         |                      |Supports applications only, not services |
| Performance                 |     XXXX                  | Initial builds and rebuilds take some time; automatic caching improves containe startup time |
|   `type`                  |   Indicates the base container image used to run the application (`major.minor`). Cannot select a patch version.  |  Indicates the Nix channel version | 
| build and deploy `hooks`     | Build flavor is run if applicable and any dependencies are installed | Managed by the Nix channel | 


## Differences in defining the keys

Only the single-runtime image supports the [``build``](/create-apps/app-reference/single-runtime-image.md#build), [``dependencies``](/create-apps/app-reference/single-runtime-image.md#dependencies), and [``runtime``](/create-apps/app-reference/single-runtime-image.md#druntime) keys. In a composable image, the equivalent is the [`stack`](/create-apps/app-reference/composable-image.html#stack) key. 

Otherwise, the same keys are available for both image types. Differences in syntax or meaning are noted in the details for that key.

## Multi-app projects
In a multiple application context, you can use a mix of single-runtime images and composable images. See the examples in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md#mix-of-images) topic and [composable](/create-apps/app-reference/composable-image.md#combine-single-runtime-and-composable-images) image topic.


<!-- the content and table above contain a variation of this content. Make sure the content below is covered on the composable image page 
Composable images can be used for applications only, not for services. This image type enables you to install multiple runtimes (such as PHP, Ruby, and so on) as well aXXX in your application container.

There are over 120,000 packages available from the [Nix Packages collection](https://search.nixos.org/) that you can add to your stack.
You can add as many packages to your application container as you need.

{{% note %}}

{{% vendor/name %}} guarantees optimal user experience with the specific [set of packages](/create-apps/app-reference/composable-image.md#supported-nix-packages) it supports.
You can use any other package available from the [Nix Packages collection](https://search.nixos.org/), including unstable ones,
but NixOs is responsible for their support.

{{% /note %}}

See [all of the options you can use](/create-apps/app-reference/composable-image.md) to define your app using the composable image.
-->