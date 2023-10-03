---
title: Set up the project
subtitle: Deploying {{% param "framework" %}} to {{% vendor/name %}}
weight: -18
description: With the tools installed, its time to prepare your {{% param "framework" %}} repository. 
framework: Django
---

<!-- {{% guides/steps ordered="true" root="/get-started/express/deploy" %}} -->

<!-- Starting options -->
{{% guides/deploy/code/start-options %}}

<!-- 1. Generate from scratch -->
{{% guides/deploy/code/generate-project "upsun_django" %}}

For Django, you can use [Cookiecutter](https://www.cookiecutter.io/) to build a project template to deploy on {{% vendor/name %}}.

1. Install Cookiecutter 

    ```bash
    pip3 install cookiecutter
    ```

1. Then generate the Django project template using Cookiecutter. If this is your first time generating a Django Cookiecutter template, you'll need to point to the full GitHub repository address:

    ```bash
    cookiecutter https://github.com/cookiecutter/cookiecutter-django --default-config --no-input
    ```

    Otherwise, you can just indicate the specific template you want to generate:

    ```bash
    cookiecutter cookiecutter-django --default-config --no-input -o upsun_django
    ```

    Then enter the created project:

    ```bash
    cd upsun_django
    ```

{{% /guides/deploy/code/generate-project %}}

<!-- 2. Migrate from GitHub -->

{{% guides/deploy/code/migrate-code "django" %}}
