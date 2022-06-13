---
title: Git merge
weight: -9
description: Add a service and see how data works between branches.
---

You have a separate environment with separate data.
Next, add a service to your development environment.

## Add a service

1. Create a services configuration file.

   ```bash
   touch .platform/services.yaml
   ```

2. Add a database in that file.

   ```yaml {location=".platform/services.yaml"}
   db:
       type: mariadb:10.5
       disk: 1024
   ```

3. Connect the database and your app.
   Add it to your app configuration:

   ```yaml {location=".platform.app.yaml"}
   relationships:
       database: "db:mysql"
   ```

4. Commit your changes and push.

Now you have a database connected to your app.
You can connect to the database using the configuration available in variables/config reader.

TODO: add examples/steps

## Data inheritance

Data is inherited from parent environments, but not from child environments.

### Data in child environments

Add a table to your development database:

```bash
platform sql --environment dev <COMMANDS_TO_COME>
```

Merge the environment:

```bash
platform merge
```

Check the data in the production environment

```bash
platform sql --environment main <COMMANDS_TO_COME>
```

### Data in parent environments

Add a table to your production database:

```bash
platform sql --environment main <COMMANDS_TO_COME>
```

Sync your development environment (this means copy the data from production):

```bash
platform sync
```

Check the data in the development environment

```bash
platform sql --environment dev <COMMANDS_TO_COME>
```

Data is there.

## What's next

Great job!
You can be done if you want to, or you can continue to monitor your app.
