---
title: "Configure TYPO3 for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for TYPO3.
---

{{< guides/config-desc name="TYPO3" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="typo3" name="TYPO3" >}}

## Service configuration: `services.yaml`

{{% guides/config-service name=TYPO3 %}}

We recommend the latest [MariaDB](/configuration/services/mysql/_index.md) version for TYPO3,
although you can also use Oracle MySQL or [PostgreSQL](/configuration/services/postgresql.md) if you prefer.
We also strongly recommend using [Redis](/configuration/services/redis.md) for TYPO3 caching.
Our TYPO3 template comes [pre-configured to use Redis](https://github.com/platformsh-templates/typo3#user-content-customizations) for caching.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/typo3" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="typo3" >}}

Note that the command `php vendor/bin/typo3cms install:generatepackagestate` is run during the build hook.
The command ensures all installed extensions are enabled
and that they can be omitted if you commit your own [`PackageStates.php` file](https://docs.typo3.org/m/typo3/reference-coreapi/master/en-us/ExtensionArchitecture/ExtensionManagement/Index.html#installing-extensions).

{{< /guides/config-app >}}

{{< guide-buttons next="Customize TYPO3" >}}
