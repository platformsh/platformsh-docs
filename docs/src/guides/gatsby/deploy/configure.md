---
title: "Configure Gatsby for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Gatsby.
---

{{% guides/config-desc name="Gatsby" noService=true %}}

## Requests configuration: `routes.yaml`

{{% guides/config-routes template="gatsby" name="Gatsby" %}}

## Service configuration: `services.yaml`

{{% guides/config-service name=Gatsby noService=true /%}}

## Application container: `.platform.app.yaml`

{{% guides/config-app template="gatsby" %}}

In the template, `yarn` is run during the build hook to install all of Gatsby's dependencies, and then `yarn build` is run to build the site and output to the `public` subdirectory. If you would rather use `npm` to manage your dependencies, you can:

- delete `yarn` from the build hook
- update `yarn build` to `npm run build` in the build hook
- delete the `build.flavor` block, which tells Platform.sh to rely solely on the build hook to define the build process for your project when set to `none`. By default, Node.js containers run `npm install` prior to the build hook, so this block can be removed entirely from the configuration.
- delete the `dependencies` block, which includes `yarn`, since it is no longer needed. 

All traffic is then directed to the `public` subdirectory once the deployment has completed via the `web.locations` section.

{{< /guides/config-app >}}

{{< guide-buttons next="Deploy Gatsby" >}}
