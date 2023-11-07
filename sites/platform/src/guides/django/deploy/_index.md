---
title: Deploy Django on {{% vendor/name %}}
sidebarTitle: Get started
weight: -130
layout: single
description: See how to get started deploying Django on {{% vendor/name %}}.
---

Django is a web application framework written in Python with a built-in ORM (Object-Relational Mapper).

This guide provides instructions for deploying, and working with, Django on {{% vendor/name %}}. 
It includes examples for working with Django on all of the major package managers: pip, Pipenv, and Poetry. 

{{% guides/starting-point name="Django" templateRepo="django4" initExample=true %}}

{{< note >}}

This guide is written for Django 4, but should apply almost exactly the same for other versions.

{{< /note >}}

{{% guides/requirements %}}

## Initialize a project

{{< guides/initialize name="Django" template="django4" >}}

If you don't have code, create a new Django project from scratch.
The following commands create a brand new Django project using [Django Admin](https://docs.djangoproject.com/en/4.1/intro/tutorial01/#creating-a-project).

```bash
django-admin startproject {{< variable "PROJECT_NAME" >}}
cd {{< variable "PROJECT_NAME" >}}
git init
git add . && git commit -m "Create basic Django app."
```

The community also provides a number of open-source starting points you can consult:

- [`django-simple-deploy`](https://github.com/ehmatthes/django-simple-deploy) maintained by [@ehmatthes](https://github.com/ehmatthes)
- [`djangox`](https://github.com/wsvincent/djangox) maintained by [@wsvincent](https://github.com/wsvincent)

{{< /guides/initialize >}}

{{< guide-buttons next="Configure repository" type="first" >}}
