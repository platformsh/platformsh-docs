---
title: "Build and Deploy"
weight: 2
description: |

---
The build process looks through the configuration files in your repository and assembles the necessary containers.
The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.
Both processes are triggered by a push to a live branch or by activating an [environment](/administration/web/environments.md) for a branch.
![Build pipeline](/images/workflow/build-pipeline.svg "0.50")

## Glossary



## The build

The build process looks through the configuration files such as, language version, build tools, and code in your repository, and assembles the necessary containers on every Git push.
The following two rules make sure you have fast, repeatable builds:

The build step is environment-independent to ensure development environments are perfect copies of production.
This means you can not connect to services (like the database) during the build.
The final built application is read-only.
If your application requires writing to the filesystem, you can specify the directories that require Read/Write access.


### The build steps

**Git push**
**Pull container image**: It pulls container images. It might be what's already in the project. It requests from platform container images.
**Validate configuration**: After you push your code, the first build step is to validate your configuration files
(`.platform.app.yaml`, `.platform/services.yaml`, and `.platform/routes.yaml`).
The Git server issues an error if validation fails, and nothing happens on the server.

{{< note >}}

While most projects have a single `.platform.app.yaml` file,
Platform.sh supports multiple applications in a single project.
It scans the repository for `.platform.app.yaml` files in subdirectories
and each directory containing one is built as an independent application.
A built application doesn't contain any directories above the one in which it's found.
The system is smart enough not to rebuild applications that have already been built,
so if you have multiple applications, only changed applications are rebuilt and redeployed.

{{< /note >}}
**Install dependencies**: Based on your application type, the system selects one of the pre-built container images and runs the following:

First, any dependencies specified in the `.platform.app.yaml` file are installed.
   Those include tools like Sass, webpack, and Drupal Console.
**Run build flavor commands**:  Then, depending on the build flavor specified in the configuration file, a series of standard commands is run.
   The default for PHP containers, for example, is running `composer install`.
**Run build hooks** Finally, the build hook from the configuration file is run.
   The build hook comprises one or more shell commands that you write to finish creating your production code base.
   That could be compiling Sass files, running a bundler, rearranging files on disk,
   compiling an application in a compiled language, or whatever else you want.
   Note that, at this point, all you are able to access is the file system; there are no services or other databases available.
**Freeze app container**:Once all of that is completed, we freeze the file system and produce a read-only container image.
That image is the final build artifact:
a reliable, repeatable snapshot of your application, built the way you want, with the environment you want.

Because container configuration (for both your application and its underlying services) is exclusively based on your configuration files
and your configuration files are managed through Git,
we know that a given container has a 1:1 relationship with a Git commit.
That means builds are always repeatable.
It also means that if we detect that there are no changes that would affect a given container,
we can skip the build step entirely and reuse the existing container image, saving a great deal of time.



The live environment is composed of multiple containers&mdash;both for your applications and for the services it depends on.
It also has a virtual network connecting them as well as a router to route incoming requests to the appropriate application.


## The deploy
The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.


### The deploy steps

**Hold requests**: First, we pause all incoming requests and hold them so that there's no interruption of service.
**Unmount current containers**: Then we disconnect the current containers from their file system mounts, if any,
and connect the file systems to the new containers instead.If it's a new branch and there is no existing file system, we clone it from the parent branch.
**Mount file systems**  Note: These shouldn't be directories that have code, because that would be a security risk.
**Expose services**: We then open networking connections between the various containers,
but only those that were specified in the configuration files (using the `relationships` key).
No configuration, no connection.
That helps with security, as only those connections that are actually needed even exist.
The connection information for each service is available in an application as environment variables.
**Run start commands**: First, if there is a `start` command specified in your `.platform.app.yaml` file to start the application, we run that.
(With PHP, this is optional.)
**Run deploy hook**:Just like the build hook, the deploy hook is any number of shell commands you need to prepare your application.
Usually this includes clearing caches, running database migrations, and so on.
You have complete access to all services here as your application is up and running,
but the file system where your code lives is now read-only.
**Serve request**: we open the floodgates and let incoming requests through to your newly deployed application.
You're done!
