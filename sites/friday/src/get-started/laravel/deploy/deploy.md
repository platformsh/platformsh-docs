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
{{< vendor/name >}} project. If you haven't already run it, run this interactive command:
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

If you are pushing your project for the first time,
{{% vendor/name %}} allocates [default resources](/manage-resources/_index.md) to each of your containers.
You can [amend those default container resources](/manage-resources/_index.md#configure-resources) after your project is deployed.

{{< note theme="warning" title="Warning" >}}

You may get the following error when you first deploy your {{% vendor/name %}} project:

```bash
The push completed but there was a deployment error ("Invalid deployment").
```

This happens when {{% vendor/name %}} doesn't know how much disk your app requires for a specific service.
Therefore, your app can only be successfully deployed after you've configured the disk amount for that service
through the {{% vendor/name %}} CLI or [through the Console](/manage-resources.md#configure-resources).

{{% vendor/name %}} is currently working on making sure default resources are successfully applied to every service container
 as soon as possible.

To set your resources through the CLI, run `upsun resources:set` and follow the prompts.

{{< /note >}}

When the build finished, you're given the URL of your deployed environment.
Click the URL to see your site.

If your environment wasn't active and so wasn't deployed, activate it by running the following command:

```bash
{{< vendor/cli >}} environment:activate
```

Et voilà, your Laravel application is live!

{{< guide-buttons next="Migrate your data" >}}
