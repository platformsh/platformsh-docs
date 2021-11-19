---
title: "Build and deploy"
weight: 2
description: |

---
The build process looks through the configuration files in your repository and assembles the necessary containers on every Git push.
The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.
Both processes are triggered by a push to a live branch or by activating an [environment](/administration/web/environments.md) for a branch.
![Build pipeline](/images/workflow/build-pipeline.svg "0.50")

## Glossary

**Build hook**: It comprises one or more shell commands that you write to finish creating your production code base.
It could be compiling Sass files, running a bundler, rearranging files on disk or compiling an application in a compiled language.

**Deploy hook**: Any number of shell commands including clearing caches, running database migrations, and so on.

**Artifact**: A custom-built  snapshot of your application that is reliable and repeatable.


## The build

The build step is environment-independent to ensure development environments are perfect copies of production.
This means you can not connect to services (like the database) during the build.
The final built application is read-only.
If your application requires writing to the filesystem, you can specify the directories that require Read/Write access.


### Build steps

**Git push**

**Pull container image**: It pulls container images that might be already in the project.

**Validate configuration**: The configuration is checked by validating the shared `.platform` directory (routes and services), as well scanning the repository for all `.platform.app.yaml files` present to validate them individually.

**Install dependencies**: If you have specified additional dependencies required by your build hook such as Saas, Webpack, or Drupal Console, and have provided valid versions, the dependencies get downloaded downloaded during this step.

**Run build flavor commands**: The build runs a series of standard commands based on the build flavor specified in the configuration file.
It is possible to override this behavior and skipping the step.

**Run build hook**: The committed build hook runs in the build container. During this time, commands have write access to the file system, but services (including other applications in your cluster) are not yet available.

**Freeze app container**: Once the previous steps are completed, the file system gets freezed and produce a read-only container image, which is the final build artifact.
The container configuration for both your application and its underlying services is exclusively based on your configuration files.
A container has a 1:1 relationship with a Git commit.
This means that builds are repeatable and that if the system detects that there are not changes for a container,
it reuses the existing container image skipping the build step and saving time.


## The deploy
The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.


### Deploy steps

**Hold requests**: The system holds incoming requests so there is no service interruption.

**Unmount current containers**: The containers gets disconnected from their file system mounts.

**Mount file systems** The containers that were disconnected in the previous step, connect the file system to the new containers.

If it's a new branch and doesn't have an existing file system, it gets cloned from the parent branch.
Note that these shouldn't be directories with code since it would be a security risk.

**Expose services**: The system opens the networking connections between the various containers that were specified in the configuration files (using the `relationships` key).
That helps with security, as only the specified connections exist.
The connection information for each service is available in an application as environment variables.

**Run start commands**: It’s technically optional for all runtimes. The only requirement is that you must have `web.commands.start` or `web.locations` and `hooks.deploy`.

**Run deploy hook**: The deploy hook is any number of shell commands including clearing caches, running database migrations, and so on. At this point you can access all services again since the application is up and running.
However, the file system where your code lives is now read-only.

**Serve request**: In this las step, the system allows the incoming requests to your newly deployed application.
