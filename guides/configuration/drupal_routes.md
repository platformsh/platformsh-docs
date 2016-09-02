# .platform/services.yaml

Create a ``routes.yaml`` file in the ``.platform`` directory that you created for your ``services.yaml`` file. Each route describes how an incoming URL is going to be processed by Platform.sh.

Open this file and paste this content:

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

For more information on routes, visit the [documentation page](https://docs.platform.sh/user_guide/reference/routes-yaml.html)
