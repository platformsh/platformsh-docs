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
- You build your own services. See the [Building your own services](#building-services) section below.
- You want the ability to install _all_ the packages you need in your application container, ensuring that an application works on any machine.<BR> 
    In a composable image, you can accomplish this by using supported Nix channels. This method ensures app consistency and helps to streamline the development, testing, and deployment processes.
    
- Your team is comfortable with upgrading, testing, and refactoring images promptly when Nix a channel becomes deprecated (every six months). 



| Criteria                    | Single-runtime image | Composable image | 
|-----------------------------|----------------------|------------------|
| # of runtimes per container | one                  | zero or more                    |
| Best for building...  | Single runtime applications  | Application with custom secondary runtimes, static applications, or installing custom binaries  | 
| Packages permitted           | Runtime and its extensions | 0 or more runtimes; extensions, services | 
| Manual configuration required for...       | Downloads, dependencies, adding packages to build hook       | Custom definition of the composition of the container using available runtimes and Nix packages | 
| Updates and security patches  | {{% vendor/name %}} performs minor (`major.`)(_`minor`_) updates and applies patches automatically upon deployment | Redeploy often to ensure that the latest package versions that are available on Nix are applied. The cadence of package updates is determined by the package maintainers. | 
|   Support                   |    See the list of supported versions of any runtime in the runtime-specific topic in the [Languages](/languages/_index.md) section.                 | Stable Nix channels only (however, any NixOS package can be installed, including `unstable` packages)                                    | 
| Performance                 |     Initial builds and rebuilds take some time; automatic caching improves container startup time                  | Same as for a single-runtime image |
|   `type`                  |   Indicates the base container image used to run the application (`major.minor`). Cannot select a patch version.  |  Indicates the Nix channel version. | 
| build and deploy `hooks`     | Build flavor is run if applicable and any dependencies are installed | Managed by the Nix channel | 


## Keys used in each image type

Only the single-runtime image supports the [``build``](/create-apps/app-reference/single-runtime-image.md#build), [``dependencies``](/create-apps/app-reference/single-runtime-image.md#dependencies), and [``runtime``](/create-apps/app-reference/single-runtime-image.md#druntime) keys. In a composable image, the equivalent is the [`stack`](/create-apps/app-reference/composable-image.html#stack) key. 

Otherwise, the same keys are available for both image types. Differences in syntax or meaning are noted in each key's topic - see the [Image properties](/create-apps/image-properties.md) section for the topics that describe each key.  

## Multi-app projects
In a multiple application context, you can use a mix of single-runtime images and composable images. See the examples in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md#combine-single-runtime-and-composable-images) topic and [composable](/create-apps/app-reference/composable-image.md#combine-single-runtime-and-composable-images) image topic.


