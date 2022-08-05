---
title: "Configuring projects"
weight: 5
toc: false
aliases:
  - "/gettingstarted/own-code/project-configuration.html"
---

In the previous step, you created a new project on Platform.sh using the CLI. Now, there are a few configuration steps left that will help Platform.sh know what to do with your application during builds and deployments.

1. **Consult a template alongside this guide**

    As you go through this guide, example files will be provided that will give you a good impression of how to configure applications on Platform.sh in the programming language they use. However, since they are basic examples and your own application may require more detailed configuration than those examples address, it is recommended that you take a look at our maintained templates for additional guidance.

    Select a language and choose one or more templates that most closely resemble your application and keep the template in another tab as you continue through this guide. Using these two resources together is the fastest way to correctly configure your project for Platform.sh.

    {{< all-templates >}}

2. **Create empty configuration files**

    Each of the templates above contain the following structure around their application code:

    ```text
    .
    ├── .platform
    │   ├── routes.yaml
    │   └── services.yaml
    ├── .platform.app.yaml
    └── < application code >
    ```

    In order to successfully deploy to Platform.sh you need to add two YAML files:

      * A `.platform/routes.yaml` file, which configures the [routes](../../../define-routes/_index.md) used in your environments.
        It describes how an incoming HTTP request is going to be processed by Platform.sh.
      * At least one file [configuring the application](../../../create-apps/_index.md).
        It provides control over the way the app is built and deployed on Platform.sh.

    If you want to use [services](../../../add-services/_index.md), you need a third file:

      * A `.platform/services.yaml` file, which configures the [services](../../../add-services/_index.md)
        that are used by the application.
        If you don't require services, you don't need the file.

    When you set Platform.sh as a remote for your repository in the previous step, the CLI automatically created the hidden configuration directory `.platform` for you. The next steps will explore in more detail what each configuration files must include, but for now create empty files in their place.

    ```bash
    touch .platform/routes.yaml
    touch .platform.app.yaml
    ```

    And if you want services:

    ```bash
    touch .platform/services.yaml
    ```

3. **(Optional) Follow the Project Setup Wizard instructions in the Console**

    All of the steps in this guide are also available in the Project Setup Wizard in your Console. Once you have created your project, the Wizard will appear at the top of your project page with detailed steps to help you properly configure your applications on Platform.sh.

    ![Project Setup Wizard](/images/management-console/setup-wizard.png "0.5")

With the empty configuration files in place, you will need to specify your service configuration in `.platform/services.yaml`.

{{< guide-buttons next="I've created empty configuration files" >}}
