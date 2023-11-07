---
title: Deploy Flask on {{% vendor/name %}}
sidebarTitle: Deploy
weight: -110
description: This guide provides instructions for deploying, and working with Flask on {{% vendor/name %}}.
layout: single
banner:
   title: Recommended
   body: To get your Flask project up and running as quickly as possible, experiment with the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project/demo) before following this guide.
---

Flask is a lightweight and popular web framework for building web applications using Python.
It is often referred to as a "micro" framework because it provides the essential components for building web applications,
but leaves many decisions and extensions up to the developer.
For more information, see the [Flask documentation](https://flask.palletsprojects.com/).

This guide provides instructions for deploying and working with Flask on {{% vendor/name %}}.</br>
If you don't want to follow the whole guide, you can get a straightforward list of required steps
in the [fast-track guide](/get-started/flask/deploy/tldr.md).

{{< note >}}
The following instructions present one way to deploy a Flask app on {{% vendor/name %}}.
To successfully deploy your app, you may need to take different steps depending on your needs,
goals, and the specific makeup of your project.
{{< /note >}}

## Before you begin

You need:

- A {{% vendor/name %}} account. [Register here](https://upsun.com/register/).
- The [{{% vendor/name %}} CLI](/administration/cli/_index.md).
- A Flask app, or [Cookiecutter](https://github.com/cookiecutter/cookiecutter),
  a command-line utility that allows you to generate a [Flask package project](https://github.com/cookiecutter-flask/cookiecutter-flask) from a template.</br>
  To install Cookiecutter, run  `pip3 install cookiecutter` in a terminal.

Let's get started!

{{< guide-buttons next="Setup Flask" type="first" >}}
