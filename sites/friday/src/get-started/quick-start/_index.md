---
title: Quick Start
weight: -100
description:   Welcome to our quick-start guide on hosting any stacks on {{< vendor/name >}} where we will demonstrate just how simple it is to host your projects on our PaaS. Follow the steps detailed below and you’ll have everything set up in no time.
---

{{% description %}}

If you're trying to host a Django, a Laravel, or a Flask stack, please follow corresponding guide:

- [Django Getting started guide](../django/_index.md)
- [Laravel Getting started guide](../laravel/_index.md)
- [Flask Getting started guide](../flask/_index.md)
- or your other favorite stack guide?

{{% guides/link-philosophy %}}

{{< note title=”Tip” >}}
To get your project up and running as quickly as possible, experiment with the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project/demo) before following this guide.
{{< /note >}}

{{% guides/requirements name="Stacks" %}}

## Create your local app

First things first, if you don’t have a local project, you need one. So please create your project locally by following the official guide of your choice.

Examples:
- [Express installation guide](https://expressjs.com/en/starter/installing.html)
- [Next.js installation guide](https://nextjs.org/docs/getting-started/installation)
- [Strapi installation guide](https://docs.strapi.io/dev-docs/installation)


## Initialize your Git repository

We need to initialize the local Git repository and commit local files, using the following command:

```bash {location="Terminal"}
git init
git add .
git commit -m "Init my application"
```

[//]: # (TODO see how to make this codetabs looks like a note section with multiple tabs)
{{< codetabs >}}
+++
title=Tips for Node.js
+++
If you're running a Node.js stack, you should also ignore adding ``node_modules`` folder (and any other unwanted folders in your Git repository) to the Git repository by using the following commands:
```bash {location="Terminal"}
echo "/node_modules" >> .gitignore
git add .gitignore && git commit -m "adding node_modules folder in .gitignore file"
```

<--->
+++
title=Tips for PHP
+++
If you're running a PHP stack with composer as dependency manager, you should also ignore adding ``vendor`` folder (and any other unwanted folders in your Git repository) to the Git repository by using the following commands:
```bash {location="Terminal"}
echo "/vendor" >> .gitignore
git add .gitignore && git commit -m "adding vendor folder in .gitignore file"
```
{{< /codetabs >}}

[//]: # (TODO rework this part as GH integration could not be part of the quickstart guide)
## Choose your Git workflow

{{% vendor/name %}} projects can be used as a classic Git repository where you will be able to push your source code in different ways, using either the Git CLI or the {{% vendor/name %}} CLI. You can choose which way—or Git workflow— you would like to use for your project from the following options:

- Your project source code will be **hosted on a {{% vendor/name %}} Git repository**
- Your project source code will be **hosted on your own GitHub repository**

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
For the rest of this guide, you will use the normal Git workflow (`git add . && git commit -m "message" && git push {{% vendor/cli %}}`) to commit your source code changes to Git history, and use the {{% vendor/name %}} CLI to deploy your [{{% vendor/name %}} environment](/environments.html) with the latest code updates.

<--->
+++
title=GitHub repository
+++
{{% vendor/name %}} provides a feature called [Github integration](integrations/source/github.md) that allows your {{% vendor/name %}} project to be fully integrated with your Github repository.
This enables you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} Console.

{{< note >}}
Please make sure you that you have already completed the following steps before adding a [Github integration](integrations/source/github.md):

1. Create a Git repository in your own organization following the relevant [Github repository creation guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).
2. Create a [Github integration](integrations/source/github.md).
3. Add a Git remote to your local project, from the root of your project, by inputting the following:

    ```bash {location="Terminal"}
    git remote add origin <urlOfYourOwnGitHubRepo>
    git add . && git commit -m "init my app"
    git push origin
    ```
{{< /note >}}

{{< /codetabs >}}

## Next steps
