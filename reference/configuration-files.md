# Configuration files

Platform.sh stores the configuration of your applications and services in YAML files within your Git repository.

Those configuration files allow you to easily interact with Platform.sh. 
You can define and configure how you want to deploy your application, 
the services you want to deploy and use, the specific routes you need to serve your
application...

Each project can have a single `.platform/` directory at its root where you can define the following configuration files:
* `services.yaml`: the services you depend on (such as databases, search engine...).
* `routes.yaml`: the routes (the way urls get mapped) to your applications. 

This is the configuration that will be common to all the applications in the same project.

Each project can have multiple applications (for example a RESTful web service
and a front-end, or a main web site and a blog). Each of these will have its own `.platform.app.yaml`.

Here are the configuration files required for one application:
```
myproject/
  .git/
  .platform/
    services.yaml
    routes.yaml
  .platform.app.yaml
```

Here are the configuration files required for multiple applications:
```
myproject/
  .git/
  .platform/
    services.yaml
    routes.yaml
  myphpapplycation/
    .platform.app.yaml
  mynodeapplication/
    .platform.app.yaml
```

> **note**
> You can find many example configurations on GitHub for [Drupal](https://github.com/platformsh/platformsh-example-drupal), [Symfony](https://github.com/platformsh/platformsh-example-symfony), [NodeJS](https://github.com/platformsh/platformsh-example-nodejs)...
