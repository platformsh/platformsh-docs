---
title: Tethered local
weight: -90
description: Connect a locally running Django server directly to active services on a {{< vendor/name >}} environment.
sectionBefore: Supported environments
---

{{< note theme="info" >}}
{{% ddev/local-note name="Django" link="/guides/django/local/ddev" %}}
{{< /note >}}

To test changes locally, you can connect your locally running Django server
to service containers on an active {{< vendor/name >}} environment.

{{% guides/local-requirements framework="Django" %}}

{{% guides/django/local-assumptions %}}

If you followed the [Django deployment guide](../deploy/_index.md),
you should have a Django configuration file with settings for [decoding variables](../deploy/customize.md#decoding-variables)
and also [overrides for {{< vendor/name >}}](../deploy/customize.md#decoding-variables).

You can use these settings to set up a tethered connection to services running on a {{< vendor/name >}} environment.
The settings are used to mock the conditions of the environment locally.

## Create the tethered connection

{{% tethered-dev/steps-start %}}

1.  To ensure your `settings.py` file acts as if in a {{< vendor/name >}} environment,
    mock two variables present in active environments:

    ```bash
    export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature
    ```

1.  To install dependencies, run the command for your package manager:

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


1.  Collect static assets.

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


1.  To start your local server, run the following command based on your package manager:

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


{{% tethered-dev/steps-end %}}

{{% local-dev/next-steps-start %}}

    Fill it with the following example, depending on your package manager:

    {{< codetabs >}}
+++
title=Pip
+++
{{< readFile file="snippets/guides/django/tethered/local-pip.sh" highlight="yaml" location="init-local.sh" >}}
<--->
+++
title=Pipenv
+++
{{< readFile file="snippets/guides/django/tethered/local-pipenv.sh" highlight="yaml" location="init-local.sh" >}}
<--->
+++
title=Poetry
+++
{{< readFile file="snippets/guides/django/tethered/local-poetry.sh" highlight="yaml" location="init-local.sh" >}}
    {{< /codetabs >}}

{{% local-dev/next-steps-end %}}

{{% guides/django/local-sanitize-example %}}
