---
title: Qdrant
sidebarTitle: Qdrant
weight: 5
---

[Qdrant](https://github.com/qdrant/qdrant) is a vector similarity search engine and vector database. It provides a production-ready service with a convenient API to store, search, and manage points—vectors with an additional payload Qdrant is tailored to extended filtering support. It makes it useful for all sorts of neural-network or semantic-based matching, faceted search, and other applications.

While Upsun does not provide an official service image for Qdrant, the database can be configured as a standalone application in a multi-applications project. This still gives you full control over the Qdrant configuration and allows for persistent storage across deployments.

## Configuration

### 1. Configure the Qdrant application

Create a qdrant application in your `.upsun/config.yaml`:

```yaml {location=".upsun/config.yaml"}
applications:
  qdrant:
    type: "composable:{{% latest composable %}}"
    container_profile: HIGH_MEMORY

    stack:
      - "qdrant"

    source:
      root: "qdrant"

    web:
      commands:
        start: "qdrant --config-path /app/config.yaml"

    mounts:
      "storage":
        source: "storage"
        source_path: "storage"
      "snapshots":
        source: "storage"
        source_path: "snapshots"
```

The example above is using a `HIGH_MEMORY` container. You can refer to the [Container profiles documentation](/manage-resources/adjust-resources.html#advanced-container-profiles) for more information.

{{< note theme="info" title="Available versions">}}
In order to run Qdrant as a standalone application without building it from source, the configuration relies on the [Composable image](/create-apps/app-reference/composable-image.html). Each [Nix](https://nix.dev/reference/glossary#term-Nix) release (channel) comes with specific package versions. You can check which Qdrant version is available on a specific release on the [Nix packages search](https://search.nixos.org/packages?show=qdrant&query=qdrant).

**This is especially important as Qdrant client librairies must use the same minor version `(x.y.*)` as the server.**
{{< /note >}}

### 2. Add the required Qdrant configuration

Qdrant relies on its own `config.yaml` configuration file in order to start instead of command-line arguments.

Add a new file named `qdrant/config.yaml` in your project. Note that the `qdrant/` directory matches the `root: "qdrant"` configuration in your `.upsun/config.yaml`.

You can find the [default configuration](https://github.com/qdrant/qdrant/blob/master/config/config.yaml) adapted for Upsun below:

```yaml {location="qdrant/config.yaml"}
log_level: ERROR

storage:
  # Where to store all the data. This is using the mount we declared earlier.
  storage_path: ./storage

  # Where to store snapshots.  This is using the mount we declared earlier.
  snapshots_path: ./snapshots

  snapshots_config:
    snapshots_storage: local

  temp_path: null
  on_disk_payload: true

  update_concurrency: null

  wal:
    wal_capacity_mb: 32
    wal_segments_ahead: 0

  node_type: "Normal"

  performance:
    max_search_threads: 0
    optimizer_cpu_budget: 0
    update_rate_limit: null

  optimizers:
    deleted_threshold: 0.2
    vacuum_min_vector_number: 1000
    default_segment_number: 0
    max_segment_size_kb: null
    indexing_threshold_kb: 10000
    flush_interval_sec: 5
    max_optimization_threads: null

  hnsw_index:
    m: 16
    ef_construct: 100
    full_scan_threshold_kb: 10000
    max_indexing_threads: 0
    on_disk: false
    payload_m: null

  shard_transfer_method: null

  collection:
    replication_factor: 1
    write_consistency_factor: 1
    vectors:
      on_disk: null
    quantization: null
    strict_mode:
      enabled: false
      max_query_limit: null
      max_timeout: null
      unindexed_filtering_retrieve: null
      unindexed_filtering_update: null
      search_max_hnsw_ef: null
      search_allow_exact: null
      search_max_oversampling: null

  max_collections: null

service:
  max_request_size_mb: 32
  max_workers: 0

  # Host to bind the service on
  host: 0.0.0.0

  # HTTP(S) port to bind the service on. We are using Upsun's default 8888. It is unfortunately not possible to use an environment variable here.
  http_port: 8888

  grpc_port: null

  enable_cors: true
  enable_tls: false
  verify_https_client_certificate: false

  # Set an api-key.
  # api_key: your_secret_api_key_here

  # Set an api-key for read-only operations.
  # read_only_api_key: your_secret_read_only_api_key_here

cluster:
  # Use `enabled: true` to run Qdrant in distributed deployment mode
  enabled: false

telemetry_disabled: true
```

The default configuration with original comments can be found on the [Qdrant GitHub repository](https://github.com/qdrant/qdrant/blob/master/config/config.yaml).

### 3. Connect from your application

To connect to Qdrant from another application in your project, add a relationship in that application configuration block:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    source:
      root: "myapp"
    type: "python:3.12"
    relationships:
      qdrant: "qdrant:http"
```

As the example uses `qdrant` as the relationship name, your application will have access to `QDRANT` environments variables.

### 4. Use the relationship in your application

Connect to Qdrant using the relationship configuration:

{{< codetabs >}}
+++
title=Python
+++

```python
import os
from qdrant_client import QdrantClient

def get_qdrant_client():
    """Create Qdrant client based on environment variables."""
    # Check for remote Qdrant configuration
    qdrant_host = os.getenv("QDRANT_HOST")
    qdrant_port = os.getenv("QDRANT_PORT", "6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    if qdrant_host:
        # Remote Qdrant instance
        return QdrantClient(
            host=qdrant_host,
            port=int(qdrant_port),
            api_key=qdrant_api_key
        )
    else:
        # Local Qdrant instance (in-memory for testing)
        return QdrantClient(":memory:")
```
<--->
+++
title=Node.js
+++

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';

function getQdrantClient(): QdrantClient {
  const qdrantHost = process.env.QDRANT_HOST;
  const qdrantPort = parseInt(process.env.QDRANT_PORT || '6333');
  const qdrantApiKey = process.env.QDRANT_API_KEY;

  if (qdrantHost) {
    return new QdrantClient({
      url: `http://${qdrantHost}:${qdrantPort}`,
      apiKey: qdrantApiKey
    });
  } else {
    // For local development, connect to localhost
    return new QdrantClient({
      url: 'http://localhost:6333'
    });
  }
}
```

{{</ codetabs >}}

__While the examples above are based on Python and Node.js applications, the same concept can be applied to any other runtime.__

## Persistent storage

The configuration includes persistent storage through mounts:

- `storage`: Stores the main Qdrant database files
- `snapshots`: Stores Qdrant snapshots

These mounts ensure that your vector data persists between deployments and application restarts.

## Access Qdrant

Qdrant runs as an internal application without external HTTP access. Other applications in your project connect to it using the `qdrant.internal` hostname through relationships.

For development and debugging, you can use port forwarding to access your Qdrant instance locally:

```bash
upsun tunnel:open
```

This creates a secure tunnel to your Qdrant application, allowing you to connect local tools and clients during development.

## Exposing Qdrant on the public internet

If you are willing to make the Qdrant database publicly accessible, add a new route to the application in the `.upsun/config.yaml` file:

```yaml {filename=".upsun/config.yaml"}
routes:
  "https://qdrant.{default}/":
    type: upstream
    upstream: "qdrant:http"
```

{{< note theme="warning" title="Exposing Qdrant">}}

Be mindful that exposing Qdrant publicly can be sensitive from a security standpoint.

{{< /note >}}

## Other resources

- [Qdrant GitHub)](https://github.com/qdrant/qdrant)
- [Qdrant official website)](https://qdrant.tech/)
