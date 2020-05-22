---
title: "Configure services"
weight: 6
toc: false
aliases:
  - "/gettingstarted/own-code/service-configuration.html"
---

In the previous step, you created a collection of empty configuration files that will allow the project to be deployed on Platform.sh.

Now you will need to include information that will tell Platform.sh how you want your application to connect to its [services]({{< relref "/configuration/services/_index.md" >}}) in a `.platform/services.yaml` file.

With the following project structure:

```text
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

An example `.platform/services.yaml` will look something like this:

`.platform/services.yaml`

{{< readFile file="static/files/fetch/servicesyaml/language-examples" highlight="yaml" >}}

If your application does not use any services at this point then you can leave it blank, but it must exist in your repository to run on Platform.sh. If your application does use a database or other services, you can configure them with the following attributes:

* `name`: Provide a name for the service, so long as it is alphanumeric. If your application requires multiple services of the same type, make sure to give them different names so that your data from one service is never overwritten by another.

* `type`: This specifies the service type and its version using the format

  ```yaml
  type:version
  ```

  Consult the table below that lists all Platform.sh maintained services, along with their `type` and supported `version`s. The links will take you to each service's dedicated page in the documentation.

  {{< readFile file="src/registry/images/tables/services_supported.md" markdownify="true">}}

* `disk`: The `disk` attribute configures the amount of persistent disk that will be allocated between all of your services. Projects by default are allocated 5 GB (5120 MB), and that space can be distributed across all of your services. Note that not all services require disk space. If you specify a `disk` attribute for a service that doesn't use it, like Redis, you will receive an error when trying to push your changes.

  {{< note >}}

  Each language and framework may have additional attributes that you will need to include in `.platform/services.yaml` depending on the needs of your application. To find out what else you may need to include to configure your services, consult

  * **The [Services]({{< relref "/configuration/services/_index.md" >}}) documentation for Platform.sh**

    The documentation goes into far more extensive detail of which attributes can also be included for service configuration, and should be used as your primary reference.

  * **Language-specific templates for Platform.sh Projects:**

    Compare the `.platform/services.yaml` file from the simple template above to other templates when writing your own.

  {{< /note >}}

Platform.sh provides _managed services_, and each service comes with considerable default configuration that you will not have to include yourself in `.services.yaml`.

Next, you will next need to tell Platform.sh how to build and deploy your application using the `.platform.app.yaml` file.

{{< guide-buttons next="I've configured my services" >}}
