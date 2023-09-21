---
title: Develop locally with Strapi v4
sidebarTitle: Strapi v4
description: How to develop a Strapi v4 app locally.
---

To run your Strapi v4 app locally with all of its services, follow these steps:

1. Download your deployed code by running the following command using the {{% vendor/name %}} CLI:

   ```bash
   {{% vendor/cli %}} get {{< variable "PROJECT_ID" >}}
   ```

2. Create a new branch.
   Whenever you develop {{% vendor/name %}}, you should develop in an isolated environment.
   This way you aren't opening SSH tunnels to your production environment.
   By creating a branch from your default environment,
   you create a new environment with copies of all production code and data.

   Create an isolated environment named `updates` by running the following command:

   ```bash
   {{% vendor/cli %}} environment:branch updates
   ```

   You can name the environment anything you want, just use the name you choose in later steps.

3. Assuming you're using a PostgreSQL or MySQL database,
   modify your database connection to look like the following:

   ```js {location="config/database.js"}
   const path = require("path");
   let connection;
   let db_relationship = "postgresdatabase";
   // Helper function for decoding {{% vendor/name %}} base64-encoded JSON variables.
   function decode(value) {
     return JSON.parse(Buffer.from(value, "base64"));
   }
   if (!process.env.PLATFORM_RELATIONSHIPS) {
     if (process.env.PLATFORM_PROJECT) {
       console.log(
         "In {{% vendor/name %}} build hook. Using default SQLite configuration until services are available."
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
         "In {{% vendor/name %}} deploy hook. Using defined service configuration."
       );
     } else {
       console.log("Using tunnel for local development.");
     }
     // Define the managed service connection.
     let credentials = decode(process.env.PLATFORM_RELATIONSHIPS)[
       db_relationship
     ][0];
     // Option 1. PostgreSQL.
     // The PostgreSQL configuration assumes the following in your {{< vendor/configfile "services" >}} file:
     //
     // dbpostgres:
     //    type: postgresql:12
     //    disk: 256
     //
     // And a relationship defined in your {{< vendor/configfile "app" >}} file as follows:
     //
     // relationships:
     //    postgresdatabase: "dbpostgres:postgresql"
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
       // The Oracle MySQL configuration assumes the following in your {{< vendor/configfile "services" >}} file:
       //
       // dbmysql:
       //    type: oracle-mysql:8.0
       //    disk: 256
       //
       // And a relationship defined in your {{< vendor/configfile "app" >}}file as follows:
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

   See the comments for explanations of individual sections.

   If you have defined the relationship to your service differently (in `{{< vendor/configfile "app" >}}`)
   or are using a different service, use that name in place of `postgresdatabase`.

4. Open a SSH tunnel to the environment's database:

   ```bash
   {{% vendor/cli %}} tunnel:open -A <APP_NAME> -e updates
   ```

   Replace `<APP_NAME>` with your app's `name` in your `{{< vendor/configfile "app" >}}` file.

   If you get the error `The pcntl PHP extension is required` error, use this command instead:

   ```bash
   {{% vendor/cli %}} tunnel:single -A <APP_NAME> -e updates
   ```

5. Add an environment variable that contains the service credentials:

   ```bash
   export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info -A <APP_NAME> -e updates --encode)"
   ```

6. Download all media uploads from the environment:

   ```bash
   {{% vendor/cli %}} mount:download -A <APP_NAME> -e updates -m public/uploads --target public/uploads -y
   ```

7. Build and start the Strapi server:

   ```bash
   yarn --frozen-lockfile
   yarn develop
   ```

Now your Strapi app should be running locally with a connection to a remote database
that's separate from your production database.
