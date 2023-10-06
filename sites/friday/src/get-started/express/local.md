---
title: "Local development"
weight: -120
description: |
  Once Your Express application has been deployed on {{% vendor/name %}}, you might want to start develop your application locally.
---

{{% description %}}

{{% guides/link-philosophy %}}

{{% guides/requirements name="Express" %}}
* Install [node CLI](https://nodejs.org/en/download/package-manager) (version >= 18.x)
* Install [Docker Composer](https://docs.docker.com/compose/install/) locally

## Create a MariaDb Docker container

At the root of your project, create a ``docker-composer.yaml`` file with the following:

```bash {location="docker-compose.yaml"}
version: '3'
volumes:
  data:
services:
  db:
    image: mariadb
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: express
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - data:/var/lib/mysql
    ports:
      - "3306:3306"
```

And launch corresponding Docker container:
```bash {location="Terminal"}
docker-compose up -d
```

## Adapt your Express application to use local Docker container

For your Express application to use the local Docker container, adapt your ``index.js`` file, function `openConnection()` with the following :
```javascript
...
function openConnection() {
  return mysql.createConnection({
    host: (process.env.DB_HOST || '127.0.0.1'),
    port: (process.env.DB_PORT || '3306'),
    user: (process.env.DB_USERNAME || 'user'),
    password: (process.env.DB_PASSWORD || 'password'),
    database: (process.env.DB_DATABASE || 'express')
  });
}
...
```

## Launch local Express application

To run your Express application locally, use the following:
```bash {location="Terminal"}
node index.js
```

And then open your favorite browser with <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.

{{< note >}}
You might want your colleague to be able to do the same, so feel free to commit your changes on your favorite Git repository to share them with your team.
{{< /note >}}
