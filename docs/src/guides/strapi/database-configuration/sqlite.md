---
title: "Configure SQLite for Strapi on Platform.sh"
sidebarTitle: "SQLite"
weight: -100
toc: false
description: |
  Configure your Strapi application to use SQLite database on Platform.sh.
---

Strapi uses SQLite database by default when it is run on a local machine. However, when creating a new Strapi project, there is the opportunity to use SQLite or a custom database installation (postgresql, mongodb, mysql). Since strapi uses SQLite by default, you do not need to do so much configuration, just follow these steps:

- In your Strapi project, Install Platfom.sh config reader.

  ```bash
  $ npm install platformsh-config OR yarn add platformsh-config
  ```

- Make sure [PostgreSQL](https://www.postgresql.org/download/) is installed on your machine.

- Create a new Strapi project and select Quickstart as the installation type, this will automatically configure strapi for SQLite

  ```bash
  $ npx create-strapi-app <name of your app>
  ```

- Replace your database.js file in the config folder with the following

  ```js
  const config = require("platformsh-config").config();
  const path = require("path");


  let dbRelationship = "pg";

  // Strapi default sqlite settings.
  let pool = {};
  let connection = {
  connection: {
  client: 'sqlite',
  connection: {
  filename: path.join(\_\_dirname, '..', process.env.DATABASE_FILENAME || '.tmp/data.db'),
  },
  useNullAsDefault: true,
    },
  };

  if (config.isValidPlatform() && !config.inBuild()) {
  // Platform.sh database configuration.
  try {
  const credentials = config.credentials(dbRelationship);
  console.log(`Using Platform.sh configuration with relationship ${dbRelationship}.`);

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
          client: "postgres",
          connection: {
            host: credentials.ip,
            port: credentials.port,
            database: credentials.path,
            user: credentials.username,
            password: credentials.password,
            ssl: false
          },
          debug: false,
          pool
        },
      };

  }
  catch (e) {
  // Do nothing if 'pg' relationship is not found.
  // Database configuration will fall back on the SQLite defaults.
    }
  } else {
  if (config.isValidPlatform()) {
  // Build hook configuration message.
  console.log('Using default configuration during Platform.sh build hook until relationships are available.');
  } else {
  // Strapi default local configuration.
  console.log('Not in a Platform.sh Environment. Using default local sqlite configuration.');
   }
  }

  // strapi-api/config/database.js
  module.exports = ({ env }) => ( connection );
  ```

This setting would automatically deploy your strapi application with an SQLite database if you do not specify a PostgreSQL service in your services.yaml file or the Strapi application is run on a local machine, it’ll automatically use the default SQLite database.
