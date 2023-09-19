---
title: Git branch
weight: -10
description: Create a separate environment for development and see how it works.
---

The next step in building out your app is adding a service.
For comfortable development and testing, start with a separate branch for development.

## Create a preview environment

To develop without affecting production, you need a separate environment.
Create one in a terminal:

```bash
{{% vendor/cli %}} branch dev main
```

This creates a separate environment with its own data.
It's based on your default branch (the last argument in the command).
This means it copies all data and services from its parent.

Because nothing about your `dev` environment is different,
it reuses the built containers from your `main` environment.
This saves time and ensures the build is the same whenever the environment is the same.

## Add environment variable

To make your `dev` environment different, change the environment by adding a variable.
Add a variable available in the build:

```bash
{{% vendor/cli %}} variable:create example --visible-build true --environment dev --value "This is a variable"
```

This `example` variable is visible in the build and so its creation triggers a new build of your app.

## Read variable

To see the difference in the environments, read the variable in each environment.

Read the variable from your `dev` environment:

```bash
{{% vendor/cli %}} variable:get --environment dev example
```

This returns a table with information on the variable including its creation date and value.

Read the variable from your `main` environment:

```bash
{{% vendor/cli %}} variable:get --environment main example
```

You get a message saying the variable wasn't found.

Differences such as this allow you to have different builds in different environments.
This is useful for things such as connecting to different databases in development and production.

Now you have a preview environment and know how it works.
Next, add a service in that environment and then merge it.

{{< get-started/next-button next="/get-started/add-data/merge.html" nextText="I'm ready to merge" >}}
