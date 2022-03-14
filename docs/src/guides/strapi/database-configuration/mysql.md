---
title: "Configure MySQL for Strapi on Platform.sh"
sidebarTitle: "MySQL/MariaDB"
weight: -80
toc: false
description: |
  Configure your strapi application to use MySQL database on Platform.sh.
---

Strapi can be configured to use MySQL as its default database. You can choose MYSQL during the installation of your application by selecting custom and PostgreSQL when asked for the installation type or you can just configure your existing Strapi application to use MySQL. In order to configure a MySQL database for Strapi on Platform.sh, follow these steps.

- Install the Node.js [mysql driver](https://yarnpkg.com/package/mysql)

  ```bash
  yarn add mysql
  ```

- In your `services.yaml` file, add the following:

  ```yaml
  mysql:
    type: oracle-mysql:8.0
    disk: 256
  ```

  **_Note that the minimum disk size for mysql/oracle-mysql is 256MB._**

- Locate your `.platform.app.yaml` file and replace the relationship name to match the mysql database service you added in the `services.yaml` file

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
    // Platform.sh database configuration.
    try {
      const credentials = config.credentials(dbRelationship);
      console.log(
        `Using Platform.sh configuration with relationship ${dbRelationship}.`
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
      // Do nothing if 'pg' relationship is not found.
      // Database configuration will fall back on the SQLite defaults.
    }
  } else {
    if (config.isValidPlatform()) {
      // Build hook configuration message.
      console.log(
        "Using default configuration during Platform.sh build hook until relationships are available."
      );
    } else {
      // Strapi default local configuration.

      console.log(
        "Not in a Platform.sh Environment. Using default local sqlite configuration."
      );
    }
  }
  // strapi-api/config/database.js
  module.exports = ({ env }) => connection;
  ```

  This setting would automatically deploy your strapi application with a MySQL database, and if you do not specify a MySQL service in your `services.yaml` file or the Strapi application is run on a local machine, it’ll automatically use the default SQLite database.
