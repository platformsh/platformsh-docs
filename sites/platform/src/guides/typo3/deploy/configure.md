---
title: "Configure TYPO3 for {{% vendor/name %}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{% vendor/name %}} project, including its three principle configuration files and how to define them for TYPO3.
---

{{% guides/config-desc name="TYPO3" %}}

{{% guides/config-app template="typo3" %}}

Note that the command `php vendor/bin/typo3cms install:generatepackagestate` is run during the build hook.
The command ensures all installed extensions are enabled
and that they can be omitted if you commit your own [`PackageStates.php` file](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ExtensionArchitecture/HowTo/ExtensionManagement.html#installing-extensions).

{{< /guides/config-app >}}

{{% guides/config-service name="TYPO3" %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for TYPO3,
although you can also use Oracle MySQL or [PostgreSQL](../../../add-services/postgresql.md) if you prefer.
We also strongly recommend using [Redis](../../../add-services/redis.md) for TYPO3 caching.
Our TYPO3 template comes [pre-configured to use Redis](https://github.com/platformsh-templates/typo3#user-content-customizations) for caching.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/typo3" highlight="yaml" >}}

{{% guides/config-routes template="typo3" name="TYPO3" %}}

{{< guide-buttons previous="Back" next="Customize TYPO3" >}}
