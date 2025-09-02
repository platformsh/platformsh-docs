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

**Single-runtime image**: This is the recommended choice for applications that are "standard", for example, a PHP application and when you want to choose the package version for your image. 

Consider using a single-runtime image when these factors are important:
- Your application requires a single runtime and no (or few) additional packages or tools. 
    You can add extensions, but most extra packages must be added to the build phase, which involves a common line installation. As a result, you might need to make  additional changes to the configuration file to get a valid configuration.   
    If you anticipate this happening, consider using a composable image. 
- You need to be able to choose specific package versions.
- You want {{% vendor/name %}} to update the image (perform package upgrades and apply security patches) rather do this maintenance yourself
- Your team has the time and knowledge to manually configure package versions and manage dependencies: For example, writing scripts to cache binaries after they're downloaded

If you initially choose a single-runtime image and your application needs change, you can move the app to a composable image: For example, if you determine that your application needs additional packages or multiple runtimes.

**Composable image** (BETA): Choose this image type for more complex applications. You can use the packages in a Nix channel, or define or "compose" the collection of packages for the container that runs your application. TYpically, composable images require more manual configuration than single-runtime images. 

Consider using a composable image when these factors are important:
- Your application requires multiple runtimes and tools, or different versions of the same package
- You build your own services. See section below.
- You want the ability to install _all_ the packages you need in your application container, ensuring that an application works on any machine. 
    In a composable image, you can accomplish this by using supported Nix channels. This method ensures app consistency and helps to streamline the development, testing, and deployment processes.
- Your team is comfortable with upgrading, testing, and refactoring images as packages are deprecated. 



| Criteria                    | Single-runtime image | Composable image | 
|-----------------------------|----------------------|------------------|
| # of runtimes per container | one                  | zero or more                    |
| Best for buildling...  | Single runtime applications  | Applications, services (see section below)  | 
| Packages permitted           | Runtime, extensions | >=0 runtimes; extensions, services | 
| Manual configuration        | Downloads, dependencies       | If not using a channel: Downloads, dependencies, testing, and resolving package incompatibilities | 
| Maintenance (upgrades and patches)  | {{% vendor/name %}} performs minor (`major.`)(_`minor`_) updates and applies patches automatically on deployment | You perform upgrades, patches, testing, and troubleshooting | 
|   Support                   |    XXX                 | Only stable Nix channels (but any NixOs package can be installed, including `unstable`)                                    | 
|  config file                | `{{< vendor/configfile "app" >}}`  |   `{{< vendor/configfile "app" >}}`           | 
| Method for adding packages         | Added manually to the build hook | Manually defined in the `stack` key |
| Performance                 |     XXXX                  | Initial builds and rebuilds take some time; automatic caching improves container startup time |
|   `type`                  |   Indicates the base container image used to run the application (`major.minor`). Cannot select a patch version.  |  Indicates the Nix channel version. | 
| build and deploy `hooks`     | Build flavor is run if applicable and any dependencies are installed | Managed by the Nix channel | 


## Differences in defining the keys

Only the single-runtime image supports the [``build``](/create-apps/app-reference/single-runtime-image.md#build), [``dependencies``](/create-apps/app-reference/single-runtime-image.md#dependencies), and [``runtime``](/create-apps/app-reference/single-runtime-image.md#druntime) keys. In a composable image, the equivalent is the [`stack`](/create-apps/app-reference/composable-image.html#stack) key. 

Otherwise, the same keys are available for both image types. Differences in syntax or meaning are noted in the details for that key.

## Multi-app projects
In a multiple application context, you can use a mix of single-runtime images and composable images. See the examples in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md#mix-of-images) topic and [composable](/create-apps/app-reference/composable-image.md#combine-single-runtime-and-composable-images) image topic.


## Building your own services {#building-services}
The composable image type is typically the recommended choice for building services that {{% vendor/name %}} doesn't offer as an image. With this image type, you install _only_ the packages that the service requires. Installing a runtime is also optional, determined by whether the service requires a runtime.

By contrast, a single-runtime image requires a runtime, and addiitonal pcakges must be added to the build phase, which requires more manual configuration.  

