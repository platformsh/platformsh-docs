---
title: Python
weight: 20
# description: All you need to know about creating a new project with {{% vendor/name %}}
---

When dealing with Python stacks, the information below may help customize your configuration.
These sections provide Python-specific configuration details, but also be sure to consult the common Upsun documentation as well:

- [Configuring applications](/create-apps)
- [Setting up managed services](/add-services)
- [Handling requests](/define-routes)

## Managing dependencies

Pip comes pre-installed in all `python` runtime containers. 
With it, you can add `pip install` to your build hook and be well on your way to builing your apps. 

If, however, you'd like to use another package manager (Poetry or Pipvenv, for example) see the [managing dependencies](/languages/python/dependencies) documentation.

## Configuring web servers

Upsun doesn't enforce an assumption of what Python web server package you are using to serve your applications.
Any server can be used on Upsun by modifying the `web.commands.start` property of your application configuration.

See the [configuring web servers](/languages/python/server) documentation for more details.

## Frameworks

The Upsun documentation includes a wide array of community resources that will help with framework-specific configuration:

- [Django](/get-started/stacks/django)
- [Flask](/get-started/stacks/flask)

## Get support

While there are virtually no restrictions to you deploying any kind of application on Upsun, configuration may still be unclear at this point.

Not to worry! The Upsun community is here to help. 
Come and say hello, share your work, ask for help, and peak in on what others are working on.

Welcome to the Upsun community!

{{% community-buttons %}}


