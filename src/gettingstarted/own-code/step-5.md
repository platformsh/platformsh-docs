# platform.sh academy



# Import your own code

## Configuring projects

In the previous step, you created a new project on Platform.sh using the CLI. Now, there are a few configuration steps left that will help Platform.sh know what to do with your application during builds and deployments.

1. **Consult a template alongside this guide**

    The first step is to see how other applications are configured to run on Platform.sh by consulting some maintained template projects. A lot 

    As you modify your configuration files, example files will be provided that will give you a good impression of how to configure simple projects on Platform.sh in the language of your choice. 
    
    However, since they are simple examples and your own application may require more detailed configuration than those examples address, it is recommended that you take a look at our maintained templates for additional guidance. 
    
    <html>
    <head>
    <link rel="stylesheet" href="/styles/styles.css">
    </head>
    <body>
    
    <center>
    <a href="/development/templates.html#php" class="buttongen lang"><img src="/images/technologies/php.svg" alt="PHP"></br></br>PHP</br>Templates</a>
    <a href="/development/templates.html#python" class="buttongen lang"><img src="/images/technologies/python.svg" alt="Python"></br></br>Python</br>Templates</a>
    <a href="/development/templates.html#nodejs" class="buttongen lang"><img src="/images/technologies/node.svg" alt="Node"></br></br>Node.js</br>Templates</a>
    </br>
    <a href="/development/templates.html#ruby" class="buttongen lang"><img src="/images/technologies/ruby.svg" alt="Ruby"></br></br>Ruby</br>Templates</a>
    <a href="/development/templates.html#go" class="buttongen lang"><img src="/images/technologies/go.svg" alt="Go"></br></br>Go</br>Templates</a>
    <a href="/development/templates.html#java" class="buttongen lang"><img src="/images/technologies/java.svg" alt="Java"></br></br>Java</br>Templates</a>
    </center>
    </br></br>
    
    </body>
    </html>

     Select a language and choose one or more templates that most closely resemble your application. Keep the template in another tab as you continue through this guide, and compare the simple examples that will follow with that template. Using these two resources together is the fastest way to correctly configure your project for Platform.sh.

2. **Create empty configuration files**

    You will notice that each of the templates above contain the following structure around their application code:
    
    ```.
    ├── .platform
    │   ├── routes.yaml
    │   └── services.yaml
    ├── .platform.app.yaml
    └── < application code >
    ```
    
    Briefly, each of these configuration files have the following purpose:
    
    * `.platform/routes.yaml` configures the [routes](/configuration/routes.md) used in your environments. That is, it describes how an incoming HTTP request is going to be processed by Platform.sh.
    * `.platform/services.yaml` configures the [services](/configuration/services.md) that will be used by the application. Connecting to Platform.sh's *batteries included* services only requires properly writing this file.
    * `.plaform.app.yaml` configures the [application](/configuration/app-containers.md) itself. It provides control over the way the application will be built and deployed on Platform.sh.

    When you set Platform.sh as a remote for your repository in the previous step, the CLI automatically created the hidden configuration directory `.platform` for you. The next steps will explore in more detail what each configuration files must include, but for now create empty files in their place.

    ```bash
    touch .platform/routes.yaml && touch .platform/services.yaml
    touch .platform.app.yaml
    ```

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-4.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-6.html" class="buttongen small">I have initialized my code with empty configuration files</a>

</center>

<br/><br/>

</body>
</html>
