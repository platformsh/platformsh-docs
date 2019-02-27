---
search:
    keywords: ['.platform.app.yaml', 'routes.yaml','services.yaml']
---
# Minimal Platform.sh configuration

In order to successfully deploy to Platform.sh you must
add three YAML files:

* At least one `.platform.app.yaml`, 
* a `.platform/routes.yaml` with at least one route, 
* and a `.platform/services.yaml` file that may be empty.

## Minimal static or PHP application:

For simple static sites it is best to have the `php` container as it does not
require to start a daemon.

### Minimal `.platform.app.yaml` :

You must specify a name for the app (it will be used in `routes.yaml`), specify its type (from the list of supported runtimes), give it some disk space, and define what directory to serve. Here we are serving the root directory of the repository:

```yaml
name: app
type: php
disk: 128
web:
    locations:
        '/':
            root: ''
            index: ['index.html']
```

For the application to be accessible you must configure at least one route. For the full documentation of application configuration see [Apps](app-containers.md).

### Minimal `.platform/routes.yaml` :

Here, in the `upstream` key we are referencing the name of the application as we have configured it above in the `.platform.app.yaml` with the `name` key.
 
```yaml
"https://{default}/":
  type: upstream
  upstream: "app:http"
```

For the full documentation on our routing system see [Routes](routes.md).

### Minimal `.platform/services.yaml` :

```yaml
 # this file may be empty but must exist
```

For the full documentation on our supported services and how to configure them see [Services](services.md).

###  That's all

Assuming you have an `index.html` file in the root of the repository it will now be served at the automatically generated domain that you will see in the UI as well as in the output of the `git push` command.


> * Note that the `web` key in `.platform.app.yaml` is not required, but the site will respond with a `404` error if it is not there.
> * Note that it is not recommended to serve anything from the root of your Git repository. It would be much better to create a sub-directory such as `public` and move `index.html` to `public/index.html`, add a default `index` and have the `web` block as follows:
>

```yaml
web:
    locations:
        '/':
            root: 'public'
            index: ['index.html']
```
