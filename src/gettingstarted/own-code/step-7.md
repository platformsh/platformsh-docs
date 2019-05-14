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

{% codetabs name="PHP", type="php", url="https://raw.githubusercontent.com/platformsh/template-php/master/.platform.app.yaml" -%}

{%- language name="Go", type="js", url="https://raw.githubusercontent.com/platformsh/template-golang/master/.platform.app.yaml" -%}

{%- language name="Python", type="py", url="https://raw.githubusercontent.com/platformsh/template-python3/master/.platform.app.yaml" -%}

{%- endcodetabs %}


The `.platform.appl.yaml` file is extremely flexible, and can contain many lines with very fine-grained control over your application. At the very least, Platform.sh requires four principle attributes in this file to control your builds:

* `name`: The [name of your application](/configuration/app/name.md) container does not have to be the same as your project name, and in most single application cases can simply name it `app`. If you are trying to to deploy [microservices](/configuration/app/multi-app.md#example-of-a-micro-service-multi-app), the only constraint is that each of these application names must be unique. You should notice in the next step, when you configure how requests are handled in `.platform/routes.yaml` that `name` is reused there, and it is important that they are the same.

* `type`: The [type](/configuration/app/type.md) attribute in `.platform.app.yaml` sets the container base image for the application, and sets the primary language. In general, `type` should have the form
  
  ```yaml
  type: <runtime>:<version>
  ```

  Set `<version>` to a version supported by Platform.sh, which you can find in the documentation under each language: 
  
    <html>
       <head>
          <title>Runtime Supported Versions</title>
          <script type = "text/javascript" src = "/scripts/images/helpers.js" ></script>
       </head>
       <body>
          <div class="wrapper">
          <div class="profile">
            <table id= "runtimeTable" border="1">
            <thead>
            <th>Language</th>
            <th><code>runtime</code></th>
            <th>Supported <code>version</code></th>
            </thead>
              <tbody>
              </tbody>
             </table>
          </div>
          </div>
       </body>
       <script>
       makeTable(json, "runtimes", "supported", "runtimeTable", false);
       </script>
       </body>
    </html>
  
* `disk`: The [disk](/configuration/app/storage.md) attribute defines that amount of persistent storage you need to have available for your application, and requires a minimum value of 256 MB. This is also the section in which you can define mounts of writable storage for your application, as Platform.sh operates default on a read-only filesystem. 
  
  If your application requires writable storage to function properly, it can be defined thusly:
  
  ```yaml
  mounts:
    'web/uploads':
        source: local
        source_path: uploads
  ```
  
  In this case, the application will be able to write to a mount that is visible in the `web/uploads` directory of the application container, and which has a local source at `/mnt/uploads`. Consult the [mounts documentation](/configuration/app/storage.md#mounts) for a more thorough discussion of how these attributes should be written.

* `web`: The `web` key configures the web server through a single web instance container running a single Nginx server process, behind which runs your application. 

    * `commands`: Defines the [command](/configuration/app/web.md#locations) to actually launch the application. The `start` key launches your application.
    * `locations`: Allows you to control how the application container responds to incoming requests at a very fine-grained level. The simplest possible [locations](/configuration/app/web.md#locations) configuration is one that simply passes all requests on to your application unconditionally:
    
      ```yaml
      web:
      locations:
          '/':
              passthru: true
      ```

* [Build and deploy tasks](/configuration/app/build.md): There are a number of ways in which your Git repository is turned into a running application. In general, the build process will run the the build flavor, install dependencies, and then execute the build hook you provide. When the build process is completed, the deploy process will run the deploy hook.

   * `build`: The `build` key defines what happens during the build process using the `flavor` property. This is a common inclusion for PHP and Node.js applications, so check the [the documentation](/configuration/app/build.md#build) to see if your configuration requires this key.
   * `dependencies`: This key makes it possible to install system-level [dependencies](/configuration/app/build.md#build-dependencies) as part of the build process.
   * `hooks`: [Hooks](/configuration/app/build.md#hooks) define custom scripts that you want to run at different points during the deployment process.
      * `build`: The [build hook](/configuration/app/build.md#build-hook) is run after the build flavor if that is present. The file system is fully writable, but no services and only a subset of variables are available at this point. The full list of build time and runtime variables is available on the [variables section](/development/variables.md#variables) of the public documentation.
      * `deploy`: The [deploy hook](/configuration/app/build.md#deploy-hook) is run after the application container has been started, but before it has started accepting requests. Services are now available, but the file system will be read-only from this point forward.
      * `post-deploy`: The [post-deploy hook](/configuration/app/build.md#post-deploy-hook) functions exactly the same as the deploy hook, but after the container is accepting connections. 
  
> Each language and framework may have additional attributes that you will need to include in `.platform.app.yaml` depending on the needs of your application. To find out what else you may need to include to configure your application, consult
> 
> * **The [Application](/configuration/app-containers.md) documentation for Platform.sh:**
>    The documentation goes into far more extensive detail of which attributes can also be included for application configuration, and should be used as your primary reference.
>    
> * **Language-specific templates for Platform.sh Projects:** 
>    Compare the `.platform.app.yaml` file from the simple template above to other templates when writing your own.

Now that you have configured your application, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-6.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-8.html" class="buttongen small">I have configured my application</a>

</center>

<br/><br/>

</body>
</html>
