---
title: "Configure application"
weight: 7
toc: false
aliases:
  - "/gettingstarted/own-code/app-configuration.html"
---

You will next need to include information that defines how you want your [application](/configuration/app/_index.md) to behave each time it is built and deployed on Platform.sh in a `.platform.app.yaml` file.

With the following project structure:

```text
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

An example `.platform.app.yaml` looks like this:

{{< codetabs >}}

---
title=Go
file=static/files/fetch/appyaml/golang
highlight=yaml
markdownify=false
---

<--->

---
title=Node.js
file=static/files/fetch/appyaml/nodejs
highlight=yaml
markdownify=false
---

<--->

---
title=PHP
file=static/files/fetch/appyaml/php
highlight=yaml
markdownify=false
---

<--->

---
title=Python
file=static/files/fetch/appyaml/python3
highlight=yaml
markdownify=false
---

{{< /codetabs >}}

The `.platform.app.yaml` file is extremely flexible, and can contain many lines with very fine-grained control over your application. At the very least, Platform.sh requires three principle attributes in this file to control your builds:

* `name`: The [name of your application](../../../configuration/app/app-reference.md) container does not have to be the same as your project name, and in most single application cases you can simply name it `app`. You should notice in the next step, when you configure how requests are handled in `.platform/routes.yaml` that `name` is reused there, and it is important that they are the same.

  {{< note >}}
  If you are trying to to deploy [microservices](/configuration/app/multi-app.md#example-of-a-micro-service-multi-app), the only constraint is that each of these application names must be unique.
  {{< /note >}}

* `type`: The [type](/configuration/app/app-reference.md) attribute in `.platform.app.yaml` sets the container base image for the application, and sets the primary language. In general, `type` should have the form

  ```yaml
  type: <runtime>:<version>
  ```

  Set `version` to one supported by Platform.sh, which you can find below as well as in the documentation for each language:

  {{< readFile file="src/registry/images/tables/runtimes_supported.md" markdownify="true">}}

* `disk`: The [disk](/configuration/app/app-reference.md) attribute defines that amount of persistent storage you need to have available for your application, and requires a minimum value of 256 MB.

There are a few additional keys in `.platform.app.yaml` you will likely need to use to fully configure your application, but are not required:

* `relationships`: [Relationships](../../../configuration/app/app-reference.md#relationships) define how services are mapped within your application. Without this block, an application cannot by default communicate with a service container. Provide a unique name for each relationship and associate it with a service. For example, if in the previous step you defined a MariaDB container in your `.platform/services.yaml` with

  {{< readFile file="src/registry/images/examples/full/mysql.services.yaml" highlight="yaml">}}

  You must define a relationship (i.e. `database`) in `.platform.app.yaml` to connect to it:

  {{< readFile file="src/registry/images/examples/full/mysql.app.yaml" highlight="yaml">}}

* [Build and deploy tasks](../../../overview/build-deploy.md): There are a number of ways in which your Git repository is turned into a running application. In general, the build process will run the build flavor, install dependencies, and then execute the build hook you provide. When the build process is completed, the deploy process will run the deploy hook.

   * `build`: The `build` key defines what happens during the build process using the `flavor` property. This is a common inclusion for PHP and Node.js applications, so check the [the documentation](/configuration/app/app-reference.md#build) to see if your configuration requires this key.
   * `dependencies`: This key makes it possible to install system-level [dependencies](/configuration/app/app-reference.md#dependencies) as part of the build process.
   * `hooks`: [Hooks](/configuration/app/hooks.md) define custom scripts that you want to run at different points during the deployment process.
      * `build`: The [build hook](/configuration/app/hooks.md#build-hook) is run after the build flavor if that is present. The file system is fully writable, but no services and only a subset of variables are available at this point. The full list of build time and runtime variables is available on the [variables section](/development/variables.md#variables) of the public documentation.
      * `deploy`: The [deploy hook](/configuration/app/hooks.md#deploy-hook) is run after the application container has been started, but before it has started accepting requests. Services are now available, but the file system will be read-only from this point forward.
      * `post-deploy`: The [post-deploy hook](/configuration/app/hooks.md#post-deploy-hook) functions exactly the same as the deploy hook, but after the container is accepting connections.

* `web`: The `web` key configures the web server through a single web instance container running a single Nginx server process, behind which runs your application.

    * `commands`: Defines the [command](/configuration/app/app-reference.md#commands) to actually launch the application. The `start` key launches your application. In all languages except for PHP, `web.commands.start` should be treated as required. For PHP, you will instead need to define a script name in `passthru`, described below in `locations`.
    * `locations`: Allows you to control how the application container responds to incoming requests at a very fine-grained level. The simplest possible [locations](/configuration/app/app-reference.md#locations) configuration is one that simply passes all requests on to your application unconditionally:

      ```yaml
      web:
          locations:
              '/':
                  passthru: true
      ```

      The above configuration forwards all requests to `/*` to the process started by `web.commands.start`. In the case of PHP containers, `passthru` must specify what PHP file to forward the request to, as well as the docroot under which the file lives. For example,

      ```yaml
      web:
          locations:
              '/':
                  root: 'web'
                  passthru: '/app.php'
      ```
* `mounts`: Configuring mounts are not required, unless part of your application requires write-access. By default, Platform.sh provided a *read-only* filesystem for your projects so that you can be confident in the health and security of your application once it has deployed.

  If your application requires writable storage to function properly (i.e., saving files; mounts should not contain code) it can be defined like so:

  ```yaml
  mounts:
      'web/uploads':
          source: local
          source_path: uploads
  ```

  In this case, the application will be able to write to a mount that is visible in the `/app/web/uploads` directory of the application container, and which has a local source at `/mnt/uploads`. Consult the [mounts documentation](/configuration/app/app-reference.md#mounts) for a more thorough discussion of how these attributes should be written.

{{< note >}}

Each language and framework may have additional attributes that you will need to include in `.platform.app.yaml` depending on the needs of your application. To find out what else you may need to include to configure your application, consult

* **The [Application](/configuration/app/_index.md) documentation for Platform.sh:**

  The documentation goes into far more extensive detail of which attributes can also be included for application configuration, and should be used as your primary reference.

* **Language-specific templates for Platform.sh Projects:**

  Compare the `.platform.app.yaml` file from the simple template above to other templates when writing your own.

{{< /note >}}


Now that you have configured your application, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

{{< guide-buttons next="I've configured my application">}}
