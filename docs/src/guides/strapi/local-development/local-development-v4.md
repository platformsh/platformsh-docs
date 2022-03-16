---
title: "Local development instructions for Strapi v4"
sidebarTitle: "Strapi v4"
weight: -80
toc: false
description: |
  How to build a Strapi v4 app locally.
---

You can run your Strapi v4 application locally with all of its services by following these steps:

1. Download your deployed application code by running the following command using the Platform.sh CLI:

   ```bash
   platform get <PROJECT_ID>
   ```

{{< note >}}

If you've already pushed your code to Platform.sh, you should already have a local repository that you can build from.
Otherwise, it will be necessary to download a local copy of your project first.

{{< /note >}}

1. In all cases for developing with Platform.sh, it's important to develop in an isolated environment.
   Don't open SSH tunnels to your production environment when developing locally.
   Branch out of your main branch by running the following command:

   ```bash
   platform environment:branch updates
   ```

1. Modify your `database.js` file in the `config` folder to look like the following:

   ```js
   const path = require("path");

   let connection;
   let db_relationship = "database";

   // Helper function for decoding Platform.sh base64 encoded JSON variables.
   function decode(value) {
     return JSON.parse(Buffer.from(value, "base64"));
   }

   if (!process.env.PLATFORM_RELATIONSHIPS) {
     if (process.env.PLATFORM_PROJECT) {
       console.log(
         "In Platform.sh build hook. Using default SQLite configuration until services are available."
       );
     } else {
       console.log(
         'Configuring local SQLite connection. \n\nIf you meant to use a tunnel, be sure to run \n\n$ export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"\n\nto connect to that service.\n'
       );
     }
     // Define the default SQLite connection.
     connection = {
       connection: {
         client: "sqlite",
         connection: {
           filename: path.join(
             __dirname,
             "..",
             process.env.DATABASE_FILENAME || ".tmp/data.db"
           ),
         },
         useNullAsDefault: true,
       },
     };
   } else {
     if (process.env.PLATFORM_PROJECT) {
       console.log(
         "In Platform.sh deploy hook. Using defined service configuration."
       );
     } else {
       console.log("Using tunnel for local development.");
     }
     // Define the managed service connection.
     let credentials = decode(process.env.PLATFORM_RELATIONSHIPS)[
       db_relationship
     ][0];

     // Option 1. PostgreSQL.
     // On Platform.sh, PostgreSQL configuration assumes the following in your .platform/services.yaml file:
     //
     // dbpostgres:
     //    type: postgresql:12
     //    disk: 256
     //
     // As well as a relationship defined in your .platform.app.yaml file as follows:
     //
     // relationships:
     //    database: "dbpostgres:postgresql"
     if (credentials.scheme == "pgsql") {
       console.log("PostgreSQL detected.");
       let postgres_pool = {
         min: 0,
         max: 10,
         acquireTimeoutMillis: 600000,
         createTimeoutMillis: 30000,
         idleTimeoutMillis: 20000,
         reapIntervalMillis: 20000,
         createRetryIntervalMillis: 200,
       };
       connection = {
         connection: {
           client: "postgres",
           connection: {
             host: credentials.ip,
             port: credentials.port,
             database: credentials.path,
             user: credentials.username,
             password: credentials.password,
             ssl: false,
           },
           debug: false,
           postgres_pool,
         },
       };
       // Option 2. Oracle MySQL.
       // On Platform.sh, Oracle MySQL configuration assumes the following in your .platform/services.yaml file:
       //
       // dbmysql:
       //    type: oracle-mysql:8.0
       //    disk: 256
       //
       // As well as a relationship defined in your .platform.app.yaml file as follows:
       //
       // relationships:
       //    database: "dbmysql:mysql"
     } else if (credentials.scheme == "mysql") {
       console.log("MySQL detected.");
       connection = {
         connection: {
           client: "mysql",
           connection: {
             host: credentials.ip,
             port: credentials.port,
             database: credentials.path,
             user: credentials.username,
             password: credentials.password,
             ssl: false,
           },
           debug: false,
         },
       };
     }
   }

   // Export the connection to Strapi.
   module.exports = ({ env }) => connection;
   ```

   The above config works only if you use a PostgreSQL or MySQL database service and a Strapi v4 application.

  **Note:**

  - Make sure to read and take note of the comments in the example above.
  - For the following steps, you may need to include the CLI flags `-p <PROJECT_ID>` and `-e <ENVIRONMENT_ID>`
    if you aren't in the project directory or if the environment is associated with an existing pull request.

1. Open a SSH tunnel to the environment's database.

   ```bash
   platform tunnel:open -A strapi
   ```

1. Mock the environment variable that contains service credentials.

   ```bash
   export PLATFORM_RELATIONSHIPS="$(platform tunnel:info -A strapi --encode)"
   ```

1. Pull public/upload files from the environment.

   ```bash
   platform mount:download -A strapi -m public/uploads --target public/uploads -y
   ```

1. Build and start the Strapi server.
   
   ```bash
   yarn --frozen-lockfile
   yarn develop
   ```
