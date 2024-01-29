---
title: DDEV (TODO)
weight: -110
layout: single
description: |
    (TODO) Set up an environment with {{% vendor/name %}}'s recommended local development tool, DDEV.
#sectionBefore: Integrated environments
---

{{< note title="DEVREL TODO">}}
This page is waiting for Randy to finish Upsun integration on DDEV side, so please do not take care of it yet,
{{< /note >}}

{{% ddev/definition %}}

{{% guides/local-requirements framework="" %}}
- DDEV installed on your computer.

  {{% ddev/requirements %}}

  {{% ddev/install %}}

{{% guides/django/local-assumptions %}}

## Set up DDEV

1.  Create a new environment off of production.

    ```bash
    {{% vendor/cli %}} branch new-feature main
    ```

    If you're using a [source integration](/integrations/source/_index.md),
    open a merge/pull request.

1. Add DDEV configuration to the project.
    ```bash
    ddev config --auto
    ```

1. Add an API token.

    {{% ddev/token %}}

1. Connect DDEV to your project and the `new-feature` environment.

    {{% ddev/connect %}}

1. Update the DDEV `post-start` hooks.

    The generated configuration contains a `hooks.post-start` attribute that contains Django's `hooks.build` and `hooks.deploy`.
    Add another item to the end of that array with the start command defined in `{{< vendor/configfile "app" >}}`:

1. Create a custom Docker Compose file to define the port exposed for the container you're building, `web`:

    ```yaml {location=".ddev/docker-compose.django.yaml"}
    version: "3.6"
    services:
        web:
            expose:
                - 8000
            environment:
                - HTTP_EXPOSE=80:8000
                - HTTPS_EXPOSE=443:8000
            healthcheck:
                test: "true"
    ```

9.  Create a custom `Dockerfile` to install Python into the container.

    ```{location=".ddev/web-build/Dockerfile.python"}
    RUN apt-get install -y python3.10 python3-pip
    ```

10. Update your allowed hosts to include the expected DDEV domain suffix:

    ```py {location="APP_NAME/settings.py"}
    ALLOWED_HOSTS = [
        'localhost',
        '127.0.0.1',
        '.platformsh.site',
        '.ddev.site'
    ]
    ```

11. Update your database configuration to include environment variables provided by DDEV:

    ```py {location="APP_NAME/settings.py"}
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_NAME'),
            'USER': os.environ.get('POSTGRES_USER'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
            'HOST': 'db',
            'PORT': 5432,
        }
    }
    ```

    This example assumes you have a PostgreSQL database with `db` as the relationship name.
    If you have a different setup, adjust the values accordingly.

12. Start DDEV.

    Build and start up Django for the first time.

    ```bash
    ddev start
    ```

    If you have another process running, you may get an error such as the following:

    ```bash
    Failed to start django: Unable to listen on required ports, port 80 is already in use
    ```

    If you do, either cancel the running process on port `80` or do both of the following:

    - Edit `router_http_port` in `.ddev/config.yaml` to another port such as `8080`.
    - Edit the `services.web.environment` variable `HTTP_EXPOSE` in `ddev/docker-compose.django.yaml` to `HTTP_EXPOSE=8080:8000`.

13. Pull data from the environment.

    Exit the currently running process (`CTRL+C`)
    and then run the following command to retrieve data from the current {{% vendor/name %}} environment:

    ```bash
    ddev pull {{% vendor/cli %}}
    ```

14. Restart DDEV

    ```bash
    ddev restart
    ```

    You now have a local development environment that's in sync with the `new-feature` environment on {{% vendor/name %}}.

15. When you finish your work, shut down DDEV.

    ```bash
    ddev stop
    ```

{{% local-dev/next-steps-start name="DDEV" %}}

    Fill it with the following example, depending on your package manager:

    {{< codetabs >}}
+++
title=Pip
+++

```bash {location="init-local.sh"}
{{< snippets/guides/django/ddev/local-pip >}}
```

<--->
+++
title=Pipenv
+++

```bash {location="init-local.sh"}
{{< snippets/guides/django/ddev/local-pipenv >}}
```

<--->
+++
title=Poetry
+++

```bash {location="init-local.sh"}
{{< snippets/guides/django/ddev/local-poetry >}}
```

    {{< /codetabs >}}

{{% local-dev/next-steps-end %}}

{{% guides/django/local-sanitize-example %}}
