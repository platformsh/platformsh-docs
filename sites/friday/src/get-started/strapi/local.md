---
title: "Local development"
weight: -120
description: |
  Once Your Strapi application has been deployed on {{% vendor/name %}}, you might want to start develop your application locally.
---

{{% description %}}

{{% guides/link-philosophy %}}

{{% guides/requirements name="Strapi" %}}
* Install [node CLI](https://nodejs.org/en/download/package-manager) (version >= 18.x)
* Install [Docker Compose](https://docs.docker.com/compose/install/) locally

## Create a MariaDb Docker container

At the root of your project, create a ``docker-composer.yaml`` file with the following:

```bash {location="docker-compose.yaml"}
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    ports:
      - 3306:5432
    volumes:
      - ~/apps/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=strapi
      - POSTGRES_USER=strapi
      - POSTGRES_DB=strapi
```

And launch corresponding Docker container:
```bash {location="Terminal"}
docker-compose up -d
```

## Launch local Strapi application

To run your Strapi application locally, use the following:
```bash {location="Terminal"}
npm run develop
```

And then it should open your admin panel using your favorite browser.

You can start develop amazing feature!

{{< note >}}
You might want your colleague to be able to do the same, so feel free to commit your changes on your favorite Git repository to share them with your team.
{{< /note >}}
