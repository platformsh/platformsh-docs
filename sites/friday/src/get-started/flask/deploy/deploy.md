---
title: Deploy your app and set project resources
sidebarTitle: "Deploy resources"
weight: -100
description: Steps required for deploying a configured Flask application to {{% vendor/name %}}.
---

To push all your changes to {{% vendor/name %}} and deploy your project,
run the following command:

1. To push all your changes to {{% vendor/name %}},
   run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:push
   ```

   The following question is displayed:

```bash
Are you sure you want to push to the main (type: production) branch?
```

2. To activate your initial environment, answer `Y`.</br>
   {{% vendor/name %}} reads your configuration files and builds your application container.

   {{< note theme="warning">}}
   When you first deploy your Upsun project, you get notified that you need to provide a disk size, and you receive a notice:

   ```bash
   The push completed but there was a deployment error ("Invalid deployment").
   ```

   {{% vendor/name %}} doesn't know how much disk your application requires for the PostgreSQL service.
   Therefore, your app can only be successfully deployed after you've configured the disk amount for the PostgreSQL service
   through the {{% vendor/name %}} CLI or [through the Console](/manage-resources.md#configure-resources).

   This error can also be triggered for other services requiring a disk.
   {{% vendor/name %}} is currently working on making sure default resources are successfully applied to every service container as soon as possible.

   {{< /note >}}

3. To [set project resources](/manage-resources.md) using the CLI, run the following command:

   ```shell
   {{% vendor/cli %}} resources:set
   ```

4. Follow the prompts to set resources for your app:

   - Define which CPU and RAM combination you want to allocate to your application container.
   - Define how many instances of our application container you want to deploy.
   - Define how much disk space you want to allocate to the mount
     [previously defined](/get-started/flask/deploy/configure.md#configure-your-upsun-project) in `{{< vendor/configfile "app" >}}`.

5. Now follow the prompts to set resources for your services, one by one:

   - Define which CPU and RAM combination you want to allocate to your service container.
   - If the service is a database, it needs persistent disk storage to save your data.
     Define how much disk space you want to allocate to your database.</br>
     Note that each {{% vendor/name %}} project starts with 5GB of data that is shared across all services.

6. To confirm your resource selections, enter `Y`.</br>
   {{% vendor/name %}} grabs the container images built previously,
   applies your resource selections to them, and deploys your full application.

{{< guide-buttons next="Handle migrations" >}}
