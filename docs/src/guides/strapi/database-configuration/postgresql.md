---
title: "Configure PostgreSQL for Strapi on Platform.sh"
sidebarTitle: "PostgreSQL"
weight: -90
toc: false
description: |
  Configure your Strapi application to use PostgreSQL database on Platform.sh.
---

Strapi can be configured to use PostgreSQL as it’s default database. You can choose PostgreSQL during the installation of your application by selecting custom and PostgreSQL when asked for the installation type or you can just configure your existing Strapi application to use postgreSQL. In order to configure a postgreSQL database for Strapi on Platform.sh, follow these steps.

- Make sure you have [PostgreSQL](https://www.postgresql.org/download/) on your machine and [pg](https://www.npmjs.com/package/pg) installed in your Strapi project. Pg comes installed with a fresh Strapi installation.

- In the `services.yaml` file, add the following:

  ```yaml
  	postgres:
  	     type: postgresql:13
           disk: 512
  ```

- Update the `.platform.app.yaml` file to reflect the database service you added by adding the following line.

  ```yaml
  # The relationships of the application with services or other applications.
  # The left-hand side is the name of the relationship as it will be exposed
  # to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
  # side is in the form `<service name>:<endpoint name>`.
  relationships:
    postgresdatabase: "postgres:postgresql"
  ```

- Go to the config folder, locate the `database.js` file in the config folder and replace the content with the following:

  ```js
  const path = require("path");
  const config = require("platformsh-config").config();

  let dbRelationship = "postgresdatabase";

  // Strapi default sqlite settings.
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
    const credentials = config.credentials(dbRelationship);
    console.log(
      `Using Platform.sh configuration with relationship ${dbRelationship}.`
    );

    let pool = {
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
        pool,
      },
    };
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

  console.log(connection);

  // export strapi database connection
  module.exports = ({ env }) => connection;
  ```

  This setting would automatically deploy your strapi application with a PostgreSQL database, and if you do not specify a PostgreSQL service in your `services.yaml` file or the Strapi application is run on a local machine, it’ll automatically use the default SQLite database.
