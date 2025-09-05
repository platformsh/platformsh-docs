---
title: Chroma
sidebarTitle: Chroma
weight: -120
---

[Chroma](https://www.trychroma.com/) is an open-source vector database designed for AI applications that need to store, query, and manage embeddings efficiently.

While Upsun does not provide an official service image for Chroma, the database can be configured as a Python application in a multi-applications project. This still gives you full control over the Chroma configuration and allows for persistent storage across deployments.

Chroma excels in several use cases:

- **Semantic Search**: Find documents based on meaning rather than exact keyword matches
- **Retrieval Augmented Generation (RAG)**: Enhance LLMs with relevant context from your knowledge base
- **Recommendation Systems**: Build similarity-based recommendation engines
- **Content Classification**: Automatically categorize documents based on their semantic content
- **Duplicate Detection**: Identify similar or duplicate content across large document collections

## Configuration

### 1. Configure the Chroma application

Create a Chroma application in your `.upsun/config.yaml`:

```yaml {location=".upsun/config.yaml"}
applications:
  chroma:
    type: "python:3.12"
    container_profile: HIGH_MEMORY
    source:
      root: "chroma"
    dependencies:
      python3:
        uv: "*"

    hooks:
      build: |
        uv init
        uv add chromadb

    web:
      commands:
        start: "uv run --no-sync chroma run --host 0.0.0.0 --port $PORT --path /app/.db"

    mounts:
      ".db":
        source: "storage"
        source_path: "db"
      ".chroma":
        source: "storage"
        source_path: "chroma"

    variables:
      env:
        uv_CACHE_DIR: "/tmp/uv-cache"
        PYTHONPATH: "."
```

The example above is using a `HIGH_MEMORY` container. You can refer to the [Container profiles documentation](/manage-resources/adjust-resources.html#advanced-container-profiles) for more information.

### 2. Connect from your application

To connect to Chroma from another application in your project, add a relationship in that application configuration block:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    source:
      root: "myapp"
    type: "python:3.12"
    relationships:
      chroma: "chroma:http"
```

As the example uses `chroma` as the relationship name, your application will have access to `CHROMA_` environments variables.

### 3. Use the relationship in your application

Connect to Chroma using the relationship configuration:

{{< codetabs >}}
+++
title=Python
+++

```python
import os
import chromadb

def get_chroma_client():
    """Create ChromaDB client based on environment variables."""
    # Check for remote ChromaDB configuration
    chroma_host = os.getenv("CHROMA_HOST")
    chroma_port = os.getenv("CHROMA_PORT", "8000")
    chroma_ssl = os.getenv("CHROMA_SSL", "false").lower() == "true"
    chroma_headers = {}

    # Optional authentication
    if os.getenv("CHROMA_AUTH_TOKEN"):
        chroma_headers["Authorization"] = f"Bearer {os.getenv('CHROMA_AUTH_TOKEN')}"

    if chroma_host:
        # Remote ChromaDB instance
        return chromadb.HttpClient(
            host=chroma_host,
            port=int(chroma_port),
            ssl=chroma_ssl,
            headers=chroma_headers
        )
    else:
        # Local ChromaDB instance
        return chromadb.Client()
```
<--->
+++
title=Node.js
+++

```javascript
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

function getChromaClient(): ChromaClient {
  const chromaHost = process.env.CHROMA_HOST;
  const chromaPort = parseInt(process.env.CHROMA_PORT || '8000');
  const chromaSsl = process.env.CHROMA_SSL?.toLowerCase() === 'true';

  if (chromaHost) {
    const auth = process.env.CHROMA_AUTH_TOKEN
      ? { provider: 'token', credentials: process.env.CHROMA_AUTH_TOKEN }
      : undefined;

    return new ChromaClient({
      path: `http${chromaSsl ? 's' : ''}://${chromaHost}:${chromaPort}`,
      auth
    });
  } else {
    return new ChromaClient();
  }
}
```

{{</ codetabs >}}

__While the examples above are based on Python and Node.js applications, the same concept can be applied to any other runtime.__

## Persistent storage

The configuration includes persistent storage through mounts:

- `.db`: Stores the main Chroma database files
- `.chroma`: Stores additional Chroma metadata

These mounts ensure that your vector data persists between deployments and application restarts.

## Access Chroma

Chroma runs as an internal application without external HTTP access. Other applications in your project connect to it using the `chroma.internal` hostname through relationships.

For development and debugging, you can use port forwarding to access your Chroma instance locally:

```bash
upsun tunnel:open
```

This creates a secure tunnel to your Chroma application, allowing you to connect local tools and clients during development.

## Exposing Chroma on the public internet

If you are willing to make the Chroma database publicly accessible, add a new route to the application in the `.upsun/config.yaml` file:

```yaml {filename=".upsun/config.yaml"}
routes:
  "https://chroma.{default}/":
    type: upstream
    upstream: "chroma:http"
```

{{< note theme="warning" title="Exposing Chroma">}}

Be mindful that exposing Chroma publicly can be sensitive from a security standpoint.

{{< /note >}}

## Other resources

- [DevCenter: Store embeddings in chroma with persistent storage (nodejs and python examples)](https://devcenter.upsun.com/posts/store-embeddings-in-chroma-with-persistent-storage-nodejs-and-python-examples/)
