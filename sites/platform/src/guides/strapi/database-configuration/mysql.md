---
title: "Configure MySQL for Strapi on {{% vendor/name %}}"
sidebarTitle: "MySQL"
weight: -80
description: |
  Configure your Strapi application to use a MySQL database on {{% vendor/name %}}.
---

Strapi can be configured to use MySQL as its default database.
You can choose MySQL when installing your app by selecting custom and MySQL when asked for the installation type.
Or you can just configure your existing Strapi application to use MySQL.
To configure a MySQL database for Strapi on {{% vendor/name %}}, follow these steps.

1. Install the Node.js [MySQL driver](https://yarnpkg.com/package/mysql)

   ```bash
   yarn add mysql
   ```

2. Replace the PostgreSQL configuration in your `{{< vendor/configfile "services" >}}` file with the following:

   ```yaml {configFile="services"}
   mysql:
     type: oracle-mysql:8.0
     disk: 256
   ```

   **_Note that the minimum disk size for MySQL/Oracle MySQL is 256MB._**

3. In your `{{< vendor/configfile "app" >}}` file, replace the relationship name to match the MySQL database you added:

   ```yaml {configFile="app"}
   relationships:
     mysqldatabase:
       service: "mysql"
       endpoint: "mysql"
   ```

4. In the `config` folder, locate the `database.js` file, and replace its content with the following:

   ```js
   const config = require("platformsh-config").config();
   const path = require("path");

   let dbRelationship = "mysqldatabase";

   // Strapi default sqlite settings.
   let pool = {};
   let connection = {
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

   if (config.isValidPlatform() && !config.inBuild()) {
     // {{% vendor/name %}} database configuration.
     try {
       const credentials = config.credentials(dbRelationship);
       console.log(
         `Using {{% vendor/name %}} configuration with relationship ${dbRelationship}.`
       );

       pool = {
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
           pool,
         },
       };
     } catch (e) {
       // Do nothing if 'pg' relationship isn't found.
       // Database configuration will fall back on the SQLite defaults.
     }
   } else {
     if (config.isValidPlatform()) {
       // Build hook configuration message.
       console.log(
         "Using default configuration during {{% vendor/name %}} build hook until relationships are available."
       );
     } else {
       // Strapi default local configuration.

       console.log(
         "Not in a {{% vendor/name %}} Environment. Using default local sqlite configuration."
       );
     }
   }
   // strapi-api/config/database.js
   module.exports = ({ env }) => connection;
   ```

This setting deploys your Strapi application with a MySQL database.
If you don't specify a MySQL service in your `{{< vendor/configfile "services" >}}` file or the Strapi application is run on a local machine
the default SQLite database is used.
