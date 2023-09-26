---
title: "Deploy Laravel"
sidebarTitle: "Deploy"
weight: -100
description: |
  Now that your Laravel app is ready, push it to {{< vendor/name >}} and import your data.
---
Now you have your configuration for deployment and your app set up to run on {{< vendor/name >}}.
Make sure all your code is committed to Git.

```bash
git add .
git commit -m 'Add Upsun configuration files'
```

As a final check, let's ensure your repository is correctly connected to your
{{< vendor/name >}} project. If you haven't already ran it, run this interactive command:
```bash
{{< vendor/cli >}} project:set-remote
```

It's now time to push it and build your Laravel application:
```bash
{{< vendor/cli >}} push
```

Your code is built, producing a read-only image that's deployed to a running cluster of containers.
If you aren't using a source integration, the log of the process is returned in your terminal.

If you're using a source integration, you can get the log by running `{{< vendor/cli >}} activity:log --type environment.push`.

When the build finished, you're given the URL of your deployed environment.
Click the URL to see your site.

If your environment wasn't active and so wasn't deployed, activate it by running the following command:

```bash
{{< vendor/cli >}} environment:activate
```


## Set the resources for your Laravel

The configuration of Laravel application is almost done. You now successfully
defined the specificities of your application and the services you intend to use.
This translates in a series of specific containers.

You now have to ensure that each of those containers benefit from the optimal
amount of resources by running this interactive command:

```bash
{{< vendor/cli >}} resources:set
```

This command iterates over your apps and services, asking you to choose a profile
size, and eventually a disk size for each of the containers.

Check the [resources section](/manage-resources.html) of the documentation to know more
about resources allocation and how to scale your Laravel apps.

{{% guides/data-migration /%}}

Go forth and deploy (even on Friday)!

{{< guide-buttons next="Workers, cron jobs, and task scheduling" >}}
