---
title: Develop locally with Strapi v3
sidebarTitle: Strapi v3
description: How to develop a Strapi v3 app locally.
---

You can run your Strapi v3 app locally with all of its services.

First install the [config reader](../../../development/variables/use-variables.md#access-variables-in-your-app) by running the following command:

```bash
npm install platformsh-config OR yarn add platformsh-config
```

It's also assumed that your `database.js` file in your `config` folder looks like this:

```js
const config = require("platformsh-config").config();

let dbRelationship = "postgresdatabase";

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
  const credentials = config.credentials(dbRelationship);
  console.log(
    `Using {{% vendor/name %}} configuration with relationship ${dbRelationship}.`
  );

  settings = {
    client: "postgres",
    host: credentials.ip,
    port: credentials.port,
    database: credentials.path,
    username: credentials.username,
    password: credentials.password,
  };

  options = {
    ssl: false,
    debug: false,
    acquireConnectionTimeout: 100000,
    pool: {
      min: 0,
      max: 10,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 600000,
      idleTimeoutMillis: 20000,
      reapIntervalMillis: 20000,
      createRetryIntervalMillis: 200,
    },
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
      connector: "bookshelf",
      settings: settings,
      options: options,
    },
  },
};
```

If it's similar to the above and you’re running a Strapi v3 application,
follow the [instructions for general local development](../../../development/local/_index.md).
