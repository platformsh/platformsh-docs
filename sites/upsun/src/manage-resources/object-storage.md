---
title: Object storage
description: Give an app an S3-compatible bucket by setting an object-storage size on its resources.
weight: -40
keywords:
  - "object storage"
  - "bucket"
  - "S3"
  - "storage"
  - "resources"
---

Object storage gives an app an S3-compatible bucket without declaring a service in your
configuration. You enable it by setting an object-storage size on the app's resources;
{{% vendor/name %}} provisions the bucket and connects it to your app. There is no
separate "create bucket" step.

{{< note theme="info" >}}

Object storage relies on [flexible resources](/manage-resources/_index.md) and is only
available on projects that use them.

{{< /note >}}

## When to use object storage

Use object storage when your app needs to store large or growing volumes of unstructured
data (uploads, media, backups, generated artifacts) and you want to reach it through the
S3 API. For small amounts of file data that a single instance reads and writes through
the filesystem, a persistent [mount](/create-apps/image-properties/mounts.md)
is usually a better fit.

## Enable object storage

Set an object-storage size on an app. The size is given in MB, in the `app:size` format.

Run `{{% vendor/cli %}} resources:set` with the `--object-storage` option:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --object-storage {{< variable "APP_NAME" >}}:{{< variable "SIZE_IN_MB" >}}
```

For example, to give the `myapp` app 512 GB (524288 MB) of object storage:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --object-storage myapp:524288
```

To view the current allocation, run `{{% vendor/cli %}} resources:get`. When an app has
object storage, the output includes an **Object storage (MB)** column.

### Sizing rules

Object storage is allocated in fixed steps, within a minimum and a maximum.
The size you request must be a multiple of the step and fall within these bounds:

| Rule    | Value               |
| ------- | ------------------- |
| Step    | 524288 MB (512 GB)  |
| Minimum | 524288 MB (512 GB)  |
| Maximum | 10485760 MB (10 TB) |

## Connect from your app

Enabling object storage adds a relationship named `object-storage` to your app. This
relationship name is reserved: if your configuration already declares a relationship
called `object-storage`, the deployment fails and asks you to rename it.

At runtime the relationship is exposed through the
[`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The `object-storage` entry provides the connection details for an S3-compatible endpoint:

| Field    | Value                            |
| -------- | -------------------------------- |
| `scheme` | `http`                           |
| `host`   | internal hostname of the service |
| `port`   | port of the service              |

The endpoint URL is `http://{{< variable "HOST" >}}:{{< variable "PORT" >}}`. The endpoint
is reachable over your project's internal network only; it isn't exposed publicly.

A single bucket is created per app, named after the app. So an app named `myapp` reaches
its bucket at `http://{{< variable "HOST" >}}:{{< variable "PORT" >}}/myapp/{{< variable "KEY" >}}`.

When configuring your S3 client, note two requirements:

- **Use path-style addressing.** The bucket name goes in the URL path
  (`http://{{< variable "HOST" >}}:{{< variable "PORT" >}}/myapp/object.txt`), not the
  hostname. Disable virtual-hosted-style addressing.
- **No credentials are required.** The endpoint doesn't use access keys. Configure your
  client with empty credentials and any placeholder region.

### Example (Python, boto3)

```python
import base64
import json
import os

import boto3

relationships = json.loads(base64.b64decode(os.environ["PLATFORM_RELATIONSHIPS"]))
endpoint = relationships["object-storage"][0]

s3 = boto3.client(
    "s3",
    endpoint_url=f"http://{endpoint['host']}:{endpoint['port']}",
    aws_access_key_id="",
    aws_secret_access_key="",
    region_name="us-east-1",  # Placeholder; not used.
    config=boto3.session.Config(s3={"addressing_style": "path"}),
)

s3.put_object(Bucket="myapp", Key="hello.txt", Body=b"Hello, World!")
```

The bucket name is the app name.

## Share a bucket across containers

Other containers can use an app's bucket through a relationship:

- A **worker** that doesn't declare its own `relationships` block inherits the parent
  app's relationships, including `object-storage`, with no extra configuration.
- A **worker** with its own `relationships` block, a **service**, or a **task** can reach
  an app's bucket by targeting that app's `object-storage` endpoint:

  ```yaml {configFile="app"}
  applications:
    myapp:
      # ...
      workers:
        queue:
          relationships:
            bucket: 'myapp:object-storage'
  ```

  The relationship name on the left (`bucket` here) is yours to choose. Targeting an app
  that doesn't have object storage configured fails the deployment.

## Resize and remove

Change the size the same way you set it, requesting another valid multiple of the step:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --object-storage myapp:1048576
```

Set the size to `0` to remove object storage from the app:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --object-storage myapp:0
```

{{< note theme="warning" title="Removal is destructive" >}}

Setting the size to `0`, or removing the app, deletes the bucket and all of its contents
on the next deployment. There's no soft-delete or retention. Back up any data you need
first.

{{< /note >}}

When you branch an environment and clone its data, the object-storage size is inherited
along with the data, so the new environment keeps its bucket.

## Limitations

- Each app gets a single bucket, named after the app. Multiple buckets per app aren't
  supported.
- A bucket belongs to one app. Other containers can share it through a relationship, but
  buckets can't be reassigned between apps.
- The endpoint is internal to the project and isn't exposed publicly.
- The following S3 features aren't implemented: bucket versioning, object locking,
  server-side encryption (SSE), access control lists (ACLs), bucket policies, and
  lifecycle policies. Requests for them return a "not implemented" error.
- Concurrent writes to the same object are last-write-wins; there's no object locking.
