# Import your own code

## Configuring projects

In the previous step, you created a new project on Platform.sh using the CLI. Now, there are a few configuration steps left that will help Platform.sh know what to do with your application during builds and deployments.

1. **Consult a template alongside this guide**

    As you go through this guide, example files will be provided that will give you a good impression of how to configure applications on Platform.sh in the language of your choice. However, since they are simple examples and your own application may require more detailed configuration than those examples address, it is recommended that you take a look at our maintained templates for additional guidance. 
    
    Select a language and choose one or more templates that most closely resemble your application and keep the template in another tab as you continue through this guide. Using these two resources together is the fastest way to correctly configure your project for Platform.sh.
    
    * [PHP Templates](/languages/php.html#project-templates)
    * [Python Templates](/languages/python.html#project-templates)
    * [Node.js Templates](/languages/nodejs.html#project-templates)
    * [Ruby Templates](/languages/ruby.html#project-templates)
    * [Go Templates](/languages/go.html#project-templates)
    * [Java Templates](/languages/java.html#project-templates)
    
<section class="examples-lists">

<div>
  <a href="/languages/php.html#project-templates">PHP Templates</a><br />
  <a href="/languages/python.html#project-templates">Python Templates</a><br />
  <a href="/languages/nodejs.html#project-templates">Node.js Templates</a><br />
</div>

<div>
  <a href="/languages/java.html#project-templates">Java Templates</a><br />
  <a href="/languages/go.html#project-templates">Go Templates</a><br />
  <a href="/languages/ruby.html#project-templates">Ruby Templates</a><br />
</div>

</section>

2. **Create empty configuration files**

    You will notice that each of the templates above contain the following structure around their application code:
    
    ```.
    ├── .platform
    │   ├── routes.yaml
    │   └── services.yaml
    ├── .platform.app.yaml
    └── < application code >
    ```
    
    In order to successfully deploy to Platform.sh you must add three YAML files:

    * A `.platform/routes.yaml` file, which configures the [routes](/configuration/routes.md) used in your environments. That is, it describes how an incoming HTTP request is going to be processed by Platform.sh.
    * A `.platform/services.yaml` file, which configures the [services](/configuration/services.md) that will be used by the application. Connecting to Platform.sh's maintained services only requires properly writing this file. While this file must be present, if your application does not require services it can remain empty.
    * At least one `.plaform.app.yaml` file, which configures the [application](/configuration/app-containers.md) itself. It provides control over the way the application will be built and deployed on Platform.sh.

    When you set Platform.sh as a remote for your repository in the previous step, the CLI automatically created the hidden configuration directory `.platform` for you. The next steps will explore in more detail what each configuration files must include, but for now create empty files in their place.

    ```bash
    touch .platform/routes.yaml && touch .platform/services.yaml
    touch .platform.app.yaml
    ```

With the empty configuration files in place, you will need to specify your service configuration in `.platform/services.yaml`.

<div id = "buttons"></div>

<script>
    var navNextText = "I have initialized my code with empty configuration files";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
