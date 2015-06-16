# `.platform/routes.yaml`
## Configure Routes

Platform.sh allows you to define the routes that will serve your
environments. 

A route describes how an incoming URL is going to be processed by
Platform.sh. The routes are stored into a `routes.yaml` file which
should be added inside the `.platform` folder at the root of your Git
repository.

As you may know, Platform.sh is capable of both managing production
environments, as of generating on-the-fly testing, development
and staging environments. This single configuration file covers
all of this.

> **note** Platform.sh also supports multiple applications per
> project. Each project has single `routes.yaml` file that defines
> which request will be routed to which application.


If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
```

Here is an example of a `routes.yaml` file:

```yaml
# .platform/routes.yaml
"http://{default}/":
  type: upstream
  upstream: "front_end:php"
"http://www.{default}/":
  type: redirect
  to: "http://{default}/"
```

In this example we will route both the naked domain, and the www subdomain to an application 
we called "front_end". You can see the [Configurind Multiple Applications](/reference/platform-app-yaml-multi-app.md) section for a more detailed view.

> **note** for the moment the upstream is always of this form, ending with ":php" this is 
> because, currently we only support PHP.. and because in the future Platform.sh will support 
> multiple  endpoints per application. Here it simply tells our router to connect, for example
> to  a service we called "front_end" and route http traffic to the PHP service running there.
> "front_end" here would therefor mean the "name" property of a `.platform.app.yaml` file. In
> most examples you will find, we call the apps "name: php", but that's mostly out of laziness.
