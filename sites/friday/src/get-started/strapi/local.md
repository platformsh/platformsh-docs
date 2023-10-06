---
title: "Local development"
weight: -120
description: |
  Once your Strapi application has been deployed on {{% vendor/name %}}, you might want to start developing your application locally.
---

{{% description %}}

{{% guides/link-philosophy %}}

{{% guides/requirements name="Strapi" %}}
* Install [node CLI](https://nodejs.org/en/download/package-manager) (version >= 18.x)
* Install [Docker Compose](https://docs.docker.com/compose/install/) locally

## Create a MariaDB Docker container

At the root of your project, create a ``docker-composer.yaml`` file with the following configuration:

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

And launch the corresponding Docker container:
```bash {location="Terminal"}
docker-compose up -d
```

## Launch your local Strapi application

To run your Strapi application locally, use the following command:
```bash {location="Terminal"}
npm run develop
```

And then it should open your **Admin** panel using your favorite browser.

You can start developing amazing features!

{{< note >}}
You might want your colleague to be able to do the same, so feel free to commit your changes on your favorite Git repository to share them with your team.
{{< /note >}}
