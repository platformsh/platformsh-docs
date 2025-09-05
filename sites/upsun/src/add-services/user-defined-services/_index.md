---
title: User-defined services
weight: -205
description: See how to add services such as databases, cache, and search engines and configure them to suit your needs.
layout: single
keywords:
  - services
---

While {{% vendor/name %}} publishes and maintains [service images](/add-services/), you can also run any other service as an application in your project as long as they rely on a HTTP-based interface for their respective clients.

## Leveraging the multi-applications feature

Any {{% vendor/name %}} project supports [multiple application containers](/create-apps/multi-app.md). You can use this feature to run a service {{% vendor/name %}} does not provide out of the box.

### Add the custom service application

In order to deploy a custom service, you need to add a new application in your `.upsun/config.yaml` file.

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    [...]
  myservice:
    source:
      root: "myservice"
```

{{% vendor/name %}} recommends to create a new `myservice` directory in your project to define the `root` argument of the service and hold any configuration file needed for it.

### Define how to install the service

All custom service will behave differently and will require a different setup.

#### **Running a binary service**

One of the easiest way to run a custom service is to directly run a compiled binary executable.

{{< note theme="info" title="Architecture requirement">}}
It is important to make sure the binary has been compiled with `amd64` support. {{% vendor/name %}} will not run any other architecture (`arm64`, `darwin`, etc.)
{{< /note >}}

Using our [Composable image](/app-reference.html#composable-image-beta) as a base image, you may also include any additional library that may be required by the service if they are available on the [Nix packages repository](https://search.nixos.org/packages).

**Example configuration**

```yaml {location=".upsun/config.yaml"}
applications:
  myservice:
    type: "composable:25.05"
    container_profile: HIGH_MEMORY

    source:
      root: "myservice"

    hooks:
      build: |
        wget https://myservice.com/releases/myservice.tar.gz
        tar -xzf myservice.tar.gz
        chmod +x myservice
    web:
      commands:
        start: "myservice --host 0.0.0.0 --port $PORT"
```

#### **Running a runtime dependant service**

Some service may run only with their matching runtime (eg. Python apps). These services are usually installable through one of the runtime package manager (`uv`, `pip`, `npm`, etc.). You can either use one of our [single-runtime images](/create-apps/app-reference/single-runtime-image.md) or the [Composable image](/create-apps/app-reference.md#composable-image-beta).

Follow your custom service installation documentation for the correct steps.

**Example configuration for a Python package**

```yaml {location=".upsun/config.yaml"}
applications:
  myservice:
    type: "python:3.12"
    container_profile: HIGH_MEMORY
    source:
      root: "myservice"
    dependencies:
      python3:
        uv: "*"

    hooks:
      build: |
        uv init
        uv add myservice

    web:
      commands:
        start: "uv run --no-sync myservice run --host 0.0.0.0 --port $PORT"
```

#### **Running a Nix package using Composable image**

As an alternative to building a service from source or installing it through a runtime package manager, our [Composable image](/create-apps/app-reference.md#composable-image-beta) leverages `Nix`. Any [available package](https://search.nixos.org/packages) can be installed. You can populate the `stack` array with a list of packages you want to include in the image.

```yaml {location=".upsun/config.yaml"}
applications:
  myservice:
    type: "composable:25.05"
    container_profile: HIGH_MEMORY

    stack:
      - "myservice"

    source:
      root: "myservice"

    web:
      commands:
        start: "myservice --host 0.0.0.0 --port $PORT"
```

As always, please refer to your custom service documentation for details instructions.

### Configure mounts

As your service will likely need to persist data, you will need to add the matching mounts to the configuration. {{% vendor/name %}} will include these mounts in your backups and will clone the content for any new environment created.

```yaml {location=".upsun/config.yaml"}
applications:
  myservice:
    mounts:
      "storage":
        source: "storage"
        source_path: "storage"
      "snapshots":
        source: "storage"
        source_path: "snapshots"
```

Please refer to the [mounts documentations](/create-apps/app-reference/single-runtime-image.html#mounts) for additional information.

You may need to specify the mount paths in your custom service configuration file or as arguments. Refer to the custom service documentation to understand its requirements.

```yaml {location=".upsun/config.yaml"}
applications:
  myservice:
    web:
      commands:
        start: "myservice --host 0.0.0.0 --port $PORT --path /app/storage"
```

### Connect the custom service to your application

To connect through the internal network to a service running as an application from your main application in your project, add a relationship in your application configuration block. Replace `myservice` in the example below with the name of your service application.

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    source:
      root: "myapp"
    type: "python:3.12"
    relationships:
      myservice: "myservice:http"
```

As the example uses `myservice` as the relationship name, your application will have access to `MYSERVICE_*` environments variables to dynamically resolve the custom service endpoint and port.

## Custom services examples

You can find the documented `.upsun/config.yaml` configurations and setup steps for the following custom services:

| Name                | Type            | Runtime           |
| ------------------- | --------------- | ----------------- |
| [Chroma](chroma.md) | Vector Database | Python            |
| [Qdrant](qdrant.md) | Vector Database | Composable image  |

{{< note theme="info" title="Suggesting a new service">}}
Want to see another custom service listed here? Reach out to us on [Discord](https://discord.gg/platformsh).
{{< /note >}}
