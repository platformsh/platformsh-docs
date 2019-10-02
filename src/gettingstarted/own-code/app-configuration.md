# Import your own code

## Configure application

You will next need to include information that defines how you want your [application](/configuration/app-containers.md) to behave each time it is built and deployed on Platform.sh in a `.platform.app.yaml` file.

```.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

An example `.platform.app.yaml` looks like this:

{% codetabs name="PHP", type="php", url="https://raw.githubusercontent.com/platformsh-templates/php/master/.platform.app.yaml" -%}

{%- language name="Go", type="js", url="https://raw.githubusercontent.com/platformsh-templates/golang/master/.platform.app.yaml" -%}

{%- language name="Python", type="py", url="https://raw.githubusercontent.com/platformsh-templates/python3/master/.platform.app.yaml" -%}

{% language name="Node.js", type="js", url="https://raw.githubusercontent.com/platformsh/platformsh-example-nodejs/master/.platform.app.yaml" -%}

{%- endcodetabs %}


The `.platform.appl.yaml` file is extremely flexible, and can contain many lines with very fine-grained control over your application. At the very least, Platform.sh requires three principle attributes in this file to control your builds:

* `name`: The [name of your application](/configuration/app/name.md) container does not have to be the same as your project name, and in most single application cases you can simply name it `app`. You should notice in the next step, when you configure how requests are handled in `.platform/routes.yaml` that `name` is reused there, and it is important that they are the same.

    > **Note**  If you are trying to to deploy [microservices](/configuration/app/multi-app.md#example-of-a-micro-service-multi-app), the only constraint is that each of these application names must be unique.

* `type`: The [type](/configuration/app/type.md) attribute in `.platform.app.yaml` sets the container base image for the application, and sets the primary language. In general, `type` should have the form

  ```yaml
  type: <runtime>:<version>
  ```

  Set `version` to one supported by Platform.sh, which you can find below as well as in the documentation for each language:

{% include "../../registry/images/tables/runtimes_supported.md" %}

* `disk`: The [disk](/configuration/app/storage.md) attribute defines that amount of persistent storage you need to have available for your application, and requires a minimum value of 256 MB.

There are a few additional keys in `.platform.app.yaml` you will likely need to use to fully configure your application, but are not required:

* `relationships`: [Relationships](/configuration/app/relationships.md) define how services are mapped within your application. Without this block, an application cannot by default communicate with a service container. Provide a unique name for each relationship and associate it with a service. For example, if in the previous step you defined a MariaDB container in your `.platform/services.yaml` with

    ```yaml
    mysqldb:
        type: mysql:10.2
        disk: 256
    ```

    You must define a relationship (i.e. `database`) in `.platform.app.yaml` to connect to it:

    ```yaml
    relationships:
        database: "mysqldb:mysql"
    ```

* [Build and deploy tasks](/configuration/app/build.md): There are a number of ways in which your Git repository is turned into a running application. In general, the build process will run the the build flavor, install dependencies, and then execute the build hook you provide. When the build process is completed, the deploy process will run the deploy hook.

   * `build`: The `build` key defines what happens during the build process using the `flavor` property. This is a common inclusion for PHP and Node.js applications, so check the [the documentation](/configuration/app/build.md#build) to see if your configuration requires this key.
   * `dependencies`: This key makes it possible to install system-level [dependencies](/configuration/app/build.md#build-dependencies) as part of the build process.
   * `hooks`: [Hooks](/configuration/app/build.md#hooks) define custom scripts that you want to run at different points during the deployment process.
      * `build`: The [build hook](/configuration/app/build.md#build-hook) is run after the build flavor if that is present. The file system is fully writable, but no services and only a subset of variables are available at this point. The full list of build time and runtime variables is available on the [variables section](/development/variables.md#variables) of the public documentation.
      * `deploy`: The [deploy hook](/configuration/app/build.md#deploy-hook) is run after the application container has been started, but before it has started accepting requests. Services are now available, but the file system will be read-only from this point forward.
      * `post-deploy`: The [post-deploy hook](/configuration/app/build.md#post-deploy-hook) functions exactly the same as the deploy hook, but after the container is accepting connections.

* `web`: The `web` key configures the web server through a single web instance container running a single Nginx server process, behind which runs your application.

    * `commands`: Defines the [command](/configuration/app/web.md#commands) to actually launch the application. The `start` key launches your application. In all languages except for PHP, `web.commands.start` should be treated as required. For PHP, you will instead need to define a script name in `passthru`, described below in `locations`.
    * `locations`: Allows you to control how the application container responds to incoming requests at a very fine-grained level. The simplest possible [locations](/configuration/app/web.md#locations) configuration is one that simply passes all requests on to your application unconditionally:

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

  In this case, the application will be able to write to a mount that is visible in the `/app/web/uploads` directory of the application container, and which has a local source at `/mnt/uploads`. Consult the [mounts documentation](/configuration/app/storage.md#mounts) for a more thorough discussion of how these attributes should be written.

> Each language and framework may have additional attributes that you will need to include in `.platform.app.yaml` depending on the needs of your application. To find out what else you may need to include to configure your application, consult
>
> * **The [Application](/configuration/app-containers.md) documentation for Platform.sh:**
>    The documentation goes into far more extensive detail of which attributes can also be included for application configuration, and should be used as your primary reference.
>    
> * **Language-specific templates for Platform.sh Projects:**
>    Compare the `.platform.app.yaml` file from the simple template above to other templates when writing your own.

Now that you have configured your application, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

<div class="buttons">
  <a class="button-link prev" onclick="gitbook.navigation.goPrev()">Back</a>
  <a class="button-link next" onclick="gitbook.navigation.goNext()">I have configured my application</a>
</div>
