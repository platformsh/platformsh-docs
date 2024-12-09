---
title: "Configure MongoDB for Strapi on {{% vendor/name %}}"
sidebarTitle: "MongoDB"
weight: -70
description: |
  Configure your strapi application to use a MongoDB database on {{% vendor/name %}} (v3 only).
---

Strapi can also be configured to use MongoDB as its default database,
although due to compatibility issues this database type is only available in Strapi v3 and [not supported in Strapi v4](https://forum.strapi.io/t/mongodb-compatibility-delayed-on-v4/4549).
To use MongoDB with a Strapi v3 application on {{% vendor/name %}}, follow these steps.

1. Install the [Strapi mongoose connector](https://yarnpkg.com/package/strapi-connector-mongoose)

   ```bash
   yarn add strapi-connector-mongoose
   ```

1. Replace the PostgreSQL configuration in your `{{< vendor/configfile "services" >}}` file with the following:

   ```yaml {configFile="services"}
   mongodb:
     type: mongodb:3.6
     disk: 512
   ```

  **_Note that the minimum disk size for MongoDB is 512MB._**

1. In your `{{< vendor/configfile "app" >}}` file, replace the relationship name to match the MongoDB database you added:

   ```yaml {configFile="app"}
   relationships:
     mongodatabase:
       service: "mongodb"
       endpoint: "mongodb"
   ```

1. In the `config` folder, locate the `database.js` file, and replace its content with the following:

   ```js
   const config = require("platformsh-config").config();
   let dbRelationshipMongo = "mongodatabase";

   // Strapi default sqlite settings.
   let settings = {
     client: "sqlite",
     filename: process.env.DATABASE_FILENAME || ".tmp/data.db",
   };

   let options = {
     useNullAsDefault: true,
   };

   if (config.isValidPlatform() && !config.inBuild()) {
     // {{% vendor/name %}} database configuration.
     const credentials = config.credentials(dbRelationshipMongo);

     console.log(
       `Using {{% vendor/name %}} configuration with relationship ${dbRelationshipMongo}.`
     );

     settings = {
       client: "mongo",
       host: credentials.host,
       port: credentials.port,
       database: credentials.path,
       username: credentials.username,
       password: credentials.password,
     };

     options = {
       ssl: false,
       authenticationDatabase: "main",
     };
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

   module.exports = {
     defaultConnection: "default",
     connections: {
       default: {
         connector: "mongoose",
         settings: settings,
         options: options,
       },
     },
   };
   ```

This configuration instructs {{% vendor/name %}} to deploy your Strapi v3 app with a MongoDB database.
