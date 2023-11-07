---
title: "Configure SQLite for Strapi on {{% vendor/name %}}"
sidebarTitle: "SQLite"
weight: -100
description: |
  Configure your Strapi application to use a SQLite database on {{% vendor/name %}}.
---

Strapi uses SQLite database by default when it's run on a local machine.
When you create a new Strapi project, you can use SQLite or a custom database installation (PostgreSQL, MongoDB, or MySQL).
Since Strapi uses SQLite by default, you don't need much configuration, just follow these steps:

1. In your Strapi project, install the [config reader](../../../development/variables/use-variables.md#access-variables-in-your-app).

   ```bash
   npm install platformsh-config
  
   # or for Yarn
   yarn add platformsh-config
   ```

1. Create a new Strapi project and select Quickstart as the installation type.
   This automatically configures Strapi for SQLite

   ```bash
   npx create-strapi-app <APP_NAME>
   ```

1. In the `config` folder, locate the `database.js` file, and replace its content with the following:

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
   // {{% vendor/name %}} database configuration.
   try {
   const credentials = config.credentials(dbRelationship);
   console.log(`Using {{% vendor/name %}} configuration with relationship ${dbRelationship}.`);

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
   // Do nothing if 'pg' relationship isn't found.
   // Database configuration falls back on the SQLite defaults.
     }
   } else {
   if (config.isValidPlatform()) {
   // Build hook configuration message.
   console.log('Using default configuration during {{% vendor/name %}} build hook until relationships are available.');
   } else {
   // Strapi default local configuration.
   console.log('Not in a {{% vendor/name %}} Environment. Using default local sqlite configuration.');
    }
   }

   // strapi-api/config/database.js
   module.exports = ({ env }) => ( connection );
   ```

This setting deploys your Strapi application with an SQLite database.
