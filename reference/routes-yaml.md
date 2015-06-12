# `.platform/routes.yaml`
## Configure Routes

Platform.sh allows you to define the routes that will serve your
environments.

A route describes how an incoming URL is going to be processed by
Platform.sh. The routes are stored into a `routes.yaml` file which
should be added inside the `.platform` folder at the root of your Git
repository.

If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
```

Here is an example of a `routes.yaml` file:

```yaml
# .platform/routes.yaml
"http://{default}/":
  type: upstream
  upstream: "php:php"
"http://www.{default}/":
  type: redirect
  to: "http://{default}/"
```


