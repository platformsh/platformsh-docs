# Configuration files

Platform.sh stores the configuration of your applications and services in YAML files that you need to commit in your Git repository.

The configuration files are stored in Git and allow you to easily
interact with Platform.sh. You can define and configure the services you
want to deploy and use, the specific routes you need to serve your
application...

Each project can have a single `.platform` directory at its root where you will configure
the services you depend on (such as databases) through the `services.yaml` file. And the routes (the way urls get mapped) to your applications through `routes.yaml`. This is the configuration 
that will be common to all the applications in the same project.

In a single project you can have multiple applications (for example a RESTful web service
and a front-end, or a main web site and a blog). Each of these will have its own `.platform.app.yaml`

> **note**
> Find many examples for those configuration files on the [platformsh-examples repository on 
Github](https://github.com/platformsh/platformsh-examples).

