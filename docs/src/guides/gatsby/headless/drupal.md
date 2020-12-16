---
title: "How to deploy Gatsby with Drupal on Platform.sh"
sidebarTitle: "Drupal"
description: |
    Drupal's JSON API module can be used as a data source for Gatsby via `gatsby-source-drupal`.
---

Platform.sh maintains a [template](https://github.com/platformsh-templates/gatsby-drupal) that you can quickly deploy and then use this guide as a reference for the Platform.sh specific changes that have been made to Gatsby and Drupal to make it work. Click the button below to sign up for a free trial account and deploy the project.

{{< dop-button template="gatsby-drupal" >}}

## Project structure

In your local clone of the template, you will notice the following project structure:

```bash
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── drupal
│   ├── <application code>
│   └── .platform.app.yaml
├── gatsby
│   ├── <application code>
│   └── .platform.app.yaml
└── README.md
```

## Shared Platform.sh configuration

When deploying a single application project to Platform.sh ([Gatsby, for example](/guides/gatsby/deploy/_index.md)), that repository needs to have three configuration files commmitted that describe its infrastructure, which are described below in detail. For [multi-app projects](/configuration/app/multi-app.md), however, two of those files remain in the project root and are shared with each application container. 

- `.platform/services.yaml`

    This file describes which [service containers](/configuration/services/_index.md) should be included in your project (i.e. a MariaDB database). Looking at the directory tree above, you will see that for multi-app projects this file is shared between each application in the cluster. Gatsby does not require services by itself to deploy, but it is likely that the backend resource it will connect to does, and so you will see 

- `.platform/routes.yaml`

    Lorem ipsum.

- `.platform.app.yaml`

    Lorem ipsum.

## Gatsby

Lorem ipsum.

## Drupal

Lorem ipsum.

## Post-install

Lorem ipsum.

## Next steps

With Gatsby now deployed and pulling content from a backend Drupal application, there are a few things you may wish to change about your project going forward.

### `applications.yaml`

You can optionally combine the application configuration (`.platform.app.yaml`) for Gatsby and Drupal into a single configuration file called `applications.yaml`. Like `services.yaml` and `routes.yaml`, this file is shared across the project and resides in the `.platform` subdirectory. It does require that you explicitly define the source of each application, so [consult the documentation](/configuration/app/multi-app.md#applicationsyaml) for more information.

### Multiple content sources

Lorem ipsum.

### Plan size

Lorem ipsum.