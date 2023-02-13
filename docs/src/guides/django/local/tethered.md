---
title: Tethered local
weight: -90
description: Connect a locally running Django server directly to active services on a Platform.sh environment.
---

{{< note theme="info" >}}
{{% ddev/local-note name="Django" link="/guides/django/local/ddev" %}}
{{< /note >}}

To test changes locally, you can connect your locally running Django server
to service containers on an active Platform.sh environment.

{{% guides/local-requirements %}}

{{% guides/django/local-assumptions %}}

If you followed the [Django deployment guide](../deploy/_index.md),
you should have a Django configuration file with settings for [decoding variables](../deploy/customize.md#decoding-variables)
and also [overrides for Platform.sh](../deploy/customize.md#decoding-variables).

You can use these settings to set up a tethered connection to services running on a Platform.sh environment.
The settings are used to mock the conditions of the environment locally.

## Create the tethered connection

1.  Create a new environment off of production.

    ```bash
    platform branch new-feature main
    ```

2.  Open an SSH tunnel to the new environment's services by running the following command:

    ```bash
    platform tunnel:open
    ```

    This command returns the addresses for SSH tunnels to all of your services.

3.  Mock the environment variables needed for your configuration file to work.

    First, export the `PLATFORMSH_RELATIONSHIPS` environment variable with information from the open tunnel:

    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```

    Then,  to ensure your `settings.py` file acts as if in a Platform.sh environment,
    mock two additional variables present in active environments:

    ```bash
    export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature
    ```

4.  Install dependencies by running the command for your package manager:

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python pip install -r requirements.txt
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv install
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry install
    {{< /codetabs >}}


5.  Collect static assets.

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python manage.py collectstatic
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv run python manage.py collectstatic
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry run python manage.py collectstatic 
    {{< /codetabs >}}


6.  Start your local server by running the following command based on your package manager:

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python manage.py runserver
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv run python manage.py runserver
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry run python manage.py runserver
    {{< /codetabs >}}


7.  When you've finished your work, close the tunnels to your services by running the following command:

    ```bash
    platform tunnel:close --all -y
    ```

{{% guides/django/local-next-steps-start %}}

    {{< codetabs >}}
+++
title=Pip
+++
{{< readFile file="snippets/guides/django/local-pip.sh" highlight="yaml" location="init-local.sh" >}}
<--->
+++
title=Pipenv
+++
{{< readFile file="snippets/guides/django/local-pipenv.sh" highlight="yaml" location="init-local.sh" >}}
<--->
+++
title=Poetry
+++
{{< readFile file="snippets/guides/django/local-poetry.sh" highlight="yaml" location="init-local.sh" >}}
    {{< /codetabs >}}

{{% guides/django/local-next-steps-end %}}
