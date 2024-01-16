---
title: "Add a database"
weight: -130
description: |
  Once Your Express application has been deployed on {{% vendor/name %}}, you might want to add a service to your application.
---

{{% description %}}

{{% vendor/name %}} projects already include a [variety of services](/add-services.html#available-services), so you don’t have to subscribe to an external cache or search-engine services.
And as these services are included in your project, you can manage them through Git and they’re backed up along with the rest of your project.
Your project source code defines the services configuration in the main `.{{% vendor/cli %}}/config.yaml` file, and this is where you can add new services.

As an example on how to do so, to add a [MariaDB database engine](/add-services/mysql.html) into your Express project, complete the following 6 steps:

## 1. Create a new branch for testing

Create a new branch using the following command:
```bash {location="Terminal"}
{{% vendor/cli %}} environment:branch add-mysql-database
```

## 2. Add a MariaDB service

Configure the MariaDB service by adding this Yaml definition at the end of your `.{{% vendor/cli %}}/config.yaml` file:

```yaml {location=".{{% vendor/cli %}}/config.yaml"}
{{< code-link destination="/add-services.html#available-services" text="services" title="Click to see the complete list of all available services" >}}:
  mariadb:
    type: mariadb:10.6
```

Connect the service to your application ``app`` by adding a relationships setting into your `app` definition:
```yaml {location=".{{% vendor/cli %}}/config.yaml"}
applications:
  app:
    type: nodejs:18
    {{< code-link destination="/create-apps/app-reference.html#relationships" text="relationships" title="The relationships of the application with services or other applications. The left-hand side is the name of the relationship as it will be exposed to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand side is in the form `<service name>:<endpoint name>`. Click for more information." >}}:
      mariadb: "mariadb:mysql"
```

Add into your ``.environment`` file the following lines:
```shell {location=".environment"}
export RELATIONSHIPS_JSON="$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)"

# Set database environment variables
export DB_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.mariadb[0].host')"
export DB_PORT="$(echo $RELATIONSHIPS_JSON | jq -r '.mariadb[0].port')"
export DB_DATABASE="$(echo $RELATIONSHIPS_JSON | jq -r '.mariadb[0].path')"
export DB_USERNAME="$(echo $RELATIONSHIPS_JSON | jq -r '.mariadb[0].username')"
export DB_PASSWORD="$(echo $RELATIONSHIPS_JSON | jq -r '.mariadb[0].password')"
```

{{< note >}}
This additional `.environment` file is located at the root of your source code. This file contains {{% vendor/name %}} specific environment variables that will be used during the deployment of your project.
{{< /note >}}

Commit your change:
```bash {location="Terminal"}
git add  .environment .{{% vendor/cli %}}/config.yaml && git commit -m "adding MariaDb database service"
{{% vendor/cli %}} push
```

{{% vendor/name %}} will now read your configuration files and deploy your project using [default container resources](/manage-resources/resource-init.md).</br>
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init.md#define-a-resource-initialization-strategy),
or [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

## 3. Configure your Express application to use this new database

First, you need a NodeJs module named ``mysql2``. Install it by running the following command:
```bash {location="Terminal"}
npm install mysql2
```

Then modify your index.js with the following :
```javascript {location="index.js"}
const express = require('express')
const app = express()
const mysql = require("mysql2/promise");
const port = (process.env.PORT || '3000');

function openConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
}

function createTable(connection) {
  return connection.execute(
    `CREATE TABLE IF NOT EXISTS {{% vendor/cli %}}info (
      uid INT(10) NOT NULL AUTO_INCREMENT,
      username VARCHAR(64) NULL DEFAULT NULL,
      departname VARCHAR(128) NULL DEFAULT NULL,
      created DATE NULL DEFAULT NULL,
      PRIMARY KEY (uid)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`
  );
}

function insertData(connection) {
  return connection.execute(
    "INSERT INTO {{% vendor/cli %}}info (username, departname, created) VALUES ('{{% vendor/cli %}}', 'Deploy Friday', '2023-09-29')"
  );
}

function readData(connection) {
  return connection.query("SELECT * FROM {{% vendor/cli %}}info");
}

function dropTable(connection) {
  return connection.execute("DROP TABLE {{% vendor/cli %}}info");
}

// Define the main route.
app.get('/', async function(req, res){

  // Connect to MariaDB.
  const connection = await openConnection();

  await createTable(connection);
  await insertData(connection);

  const [rows] = await readData(connection);

  const droppedResult = await dropTable(connection);

  // Make the output.
  const outputString = `Hello, World! - A simple Express web framework template for {{% vendor/name %}}

MariaDB Tests:

* Connect and add row:
  - Row ID (1): ${rows[0].uid}
  - Username ({{% vendor/cli %}}): ${rows[0].username}
  - Department (Deploy Friday): ${rows[0].departname}
  - Created (2023-09-29): ${rows[0].created}
* Delete row:
  - Status (0): ${droppedResult[0].warningStatus}`;

  res.set('Content-Type', 'text/plain');
  res.send(outputString);
});

// Get PORT and start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`)
});
```

Commit your changes and deploy your changes:
```bash {location="Terminal"}
git add package.json package-lock.json index.js && git commit -m "adding MariaDb database service"
{{% vendor/cli %}} push
{{% vendor/cli %}} environment:url --primary
```

## 4. Merge to production

When satisfied with your changes, merge them to the main branch, and remove the feature branch:

```bash {location="Terminal"}
{{% vendor/cli %}} merge
 Are you sure you want to merge add-mysql-database into its parent, main? [Y/n] y
```

{{< note >}}
You can [adjust your project resources](/manage-resources/adjust-resources.md) at any time.
{{< /note >}}

## 5. Remove the feature branch

Then, you need to remove the feature branch
```bash {location="Terminal"}
{{% vendor/cli %}} checkout main
git pull {{% vendor/cli %}} main
{{% vendor/cli %}} environment:delete add-mysql-database
git fetch --prune
```

{{< note >}}
During `environment:delete` CLI command, it will ask question regarding deactivation and deletion of your `add-mysql-database` environment. Please say `yes` (`y`) to all of them.
{{< /note >}}

## Tips & Tricks

You can get your project relationships information using the following command:
```bash {location="Terminal"}
{{% vendor/cli %}} relationships
  ...
  mariadb:
    -
      username: user
      scheme: mysql
      service: mariadb
      fragment: null
      ip: 198.12.123.45
      hostname: abcdefghijklm1234567890123.mariadb.service._.<region>.{{< vendor/urlraw "hostname" >}}
      public: false
      cluster: abcdefgh1234567-add-mysql-database-abcd123
      host: mariadb.internal
      rel: mysql
      query:
        is_master: true
      path: main
      password: ''
      type: 'mariadb:10.6'
      port: 3306
      host_mapped: false
      url: 'mysql://user:@mariadb.internal:3306/main'
```
