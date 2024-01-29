---
title: Deploy
weight: 30
description:  It's time to deploy, find all useful info there.
---

## Deploy

And just like that, it’s time to deploy!

Depending on the Git workflow you choose at the beginning of this tutorial, there are two ways to deploy your source code changes.

{{< codetabs >}}

+++
title=Using {{% vendor/name %}} Git repository
+++

When using the {{% vendor/name %}} Git repository as your main repository, you can push your code using the normal Git workflow (`git add . && git commit -m "message" && git push {{% vendor/cli %}}`). This pushes your source code changes to your `{{% vendor/cli %}}` remote repository. Alternatively, you can use the following {{% vendor/name %}} CLI command:
```bash {location="Terminal"}
{{% vendor/cli %}} push
```

<--->
+++
title=Using third-party Git repository
+++

When using an external Git repository (GitHub, GitLab, or Bitbucket) to store your source code and having the Git integration feature enabled, on each code updates, you will need to use the normal Git workflow (`git add . && git commit -m "message" && git push`) to push your code to your external repository. To do so, run the following command:
```bash {location="Terminal"}
git push origin
```

Your GitHub/GitLab/Bibucket integration process will then automatically create a new environment if you’re pushing a new Git branch, and deploy changes to your corresponding environment.
{{< /codetabs >}}

{{% vendor/name %}} will now read your configuration files, and begin building your application image.

{{< note >}}
By default, {{% vendor/name %}} will use the default resource allocation for each of your services/apps. To change allocated resources to each of your services/apps, please see [how to set resources to your project](./set-resources.md) section
{{< /note >}}

Et voilà, your application is live!

[//]: # (**Your first push)

[//]: # (will fail**; don't worry, this is expected. At this point {{% vendor/cli %}} is not aware of the resources)

[//]: # (your application needs. You need to define how much CPU, memory, and disk to assign to the various containers. Back in your terminal, run:)

{{< guide-buttons type="*" >}}
