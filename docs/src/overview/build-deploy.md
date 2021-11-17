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

Build hook: The build hook comprises one or more shell commands that you write to finish creating your production code base.
That could be compiling Sass files, running a bundler, rearranging files on disk,
compiling an application in a compiled language, or whatever else you want.
Artifact: a reliable, repeatable snapshot of your application, built the way you want, with the environment you want.


## The build

The build process looks through the configuration files such as, language version, build tools, and code in your repository, and assembles the necessary containers on every Git push.
The following two rules make sure you have fast, repeatable builds:

The build step is environment-independent to ensure development environments are perfect copies of production.
This means you can not connect to services (like the database) during the build.
The final built application is read-only.
If your application requires writing to the filesystem, you can specify the directories that require Read/Write access.


### The build steps

**Git push**
**Pull container image**: It pulls container images that might be what's already in the project.
**Validate configuration**: After you push your code, the first build step is to validate your configuration files
(`.platform.app.yaml`, `.platform/services.yaml`, and `.platform/routes.yaml`).
The Git server issues an error if the validation fails and nothing happens on the server.

{{< note >}}

While most projects have a single `.platform.app.yaml` file,
Platform.sh supports multiple applications in a single project.
It scans the repository for `.platform.app.yaml` files in subdirectories
and each directory containing one is built as an independent application.
A built application doesn't contain any directories above the one in which it's found.
The system is smart enough not to rebuild applications that have already been built,
so if you have multiple applications, only changed applications are rebuilt and redeployed.

{{< /note >}}

**Install dependencies**: Based on your application type, the system selects one of the pre-built container images and runs any dependencies specified in the `.platform.app.yaml` including tools
like Sass, webpack, and Drupal Console.
**Run build flavor commands**: The build runs a series of standard commands based on the build flavor specified in the configuration file.
**Run build hooks**: The build hook defined in the configuration file gets triggered. During this time, you can only access the file system, services and databases aren't available.    
**Freeze app container**: Once the previous steps are completed, the file system gets freezed and produce a read-only container image, which is the final build artifact.

{{< note >}}

The container configuration for both your application and its underlying services is exclusively based on your configuration files that are managed through Git.
A container has a 1:1 relationship with a Git commit meaning that builds are repeatable and that if the system detects that there are not changes for a container, it reuses the existing container image skipping the build step and saving time.

{{< /note >}}


## The deploy
The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.


### The deploy steps

**Hold requests**: The system holds incoming requests so there is no service interruption.
**Unmount current containers**: The containers gets disconnected from their file system mounts.
**Mount file systems** The containers that were disconnected in the previous step, connect the file system to the new containers.
If it's a new branch and doesn't have an existing file system, it gets cloned from the parent branch.
Note that these shouldn't be directories with code since it would be a security risk.
**Expose services**: The system opens the networking connections between the various containers
that were specified in the configuration files (using the `relationships` key).
That helps with security, as only the specified connections exist.
The connection information for each service is available in an application as environment variables.
**Run start commands**: This step runs if there is a `start` command specified in the `.platform.app.yaml` file to start the application (With PHP, this is optional).
**Run deploy hook**: The deploy hook is any number of shell commands including clearing caches, running database migrations, and so on. At this point you can access all services again since the application is up and running.
However, the file system where your code lives is now read-only.
**Serve request**: In this las step, the system allows the incoming requests to your newly deployed application.
