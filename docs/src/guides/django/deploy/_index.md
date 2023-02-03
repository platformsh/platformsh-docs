---
title: Deploy Django on Platform.sh
sidebarTitle: Get started
weight: -130
layout: single
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Django.
---

Django is a web application framework written in Python with a built-in ORM (Object-Relational Mapper).

This guide provides instructions for deploying, and working with, Django on Platform.sh. 
It includes examples for working with Django on all of the major package managers: pip, Pipenv, and Poetry. 

{{% guides/starting-point name="Django" templateRepo="django4" %}}

{{< note >}}

This guide is written for Django 4, but should apply almost exactly the same for other versions.

{{< /note >}}

## Tools

{{% guides/tools %}}

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="Django" template="django4" %}}

3. Initialize or clone your Git repository with existing code or create a new Django project from scratch.
   The commands below create a brand new Django project using [Django Admin](https://docs.djangoproject.com/en/4.1/intro/tutorial01/#creating-a-project), which you can then modify according to the rest of this guide.

   ```bash
   django-admin startproject mysite
   cd <PROJECT_NAME>
   git init
   git add . && git commit -m "Create basic Django app."
   ```

   The community also provides a number of open-source starting points you can consult:

    - [`django-simple-deploy`](https://github.com/ehmatthes/django-simple-deploy) maintained by [@ehmatthes](https://github.com/ehmatthes)
    - [`djangox`](https://github.com/wsvincent/djangox) maintained by [@wsvincent](https://github.com/wsvincent)

{{% /guides/signup %}}

{{< guide-buttons next="Configure repository" type="first" >}}
