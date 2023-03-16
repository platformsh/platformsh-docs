---
title: "Use a third party Git provider"
sidebarTitle: "Use a third party Git provider"
weight: -100
description: "Use integration capability to link your Symfony application to an existing third party Git provider"
---

When you choose to use a third-party Git hosting service
the Platform.sh Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third party repository.

The process varies a bit for each supported service, so check the specific pages for each one.

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Accept the default options or modify to fit your needs.

All of your existing branches are automatically synchronized to Platform.sh.
You get a deploy failure message because you haven't provided configuration files yet.
You add them in the next step.

If you're integrating a repository to Platform.sh that contains a number of open pull requests,
don't use the default integration options.
Projects are limited to three\* development environments (active and deployed branches or pull requests)
and you would need to deactivate them individually to test this guide's migration changes.

Instead, each service integration should be made with the following flag:

```bash
symfony cloud:integration:add --type=service ... --build-pull-requests=false
```

You can then go through this guide and activate the environment when you're ready to deploy

\* You can purchase additional development environments at any time in the [Web Console](/administration/web/_index.md).
Open your project and select **Edit plan**.
Add additional **Environments**, view a cost estimate, and confirm your changes.


{{% guides/deployment Symfony=true %}}

## Deploy your Project
Use common way to push your code to your Git repository, and the integration will automatically deploy your Git branch to corresponding Platform.sh environment.
```bash
git push origin
```

## Working on a Project

Now that the project is deployed, let's describe a typical scenario where you want to fix a bug or add a new feature.

First, you need to know that the main branch always represents the production environment. Any other branch is for developing new features, fixing bugs, or updating the infrastructure.

Let's create a new environment (a Git branch) to make some changes, without impacting production:

```bash
git checkout main
git checkout -b feat-a
```

This command creates a new local feat-a Git branch based on the main Git branch

Let's make some simple visual changes.
If you have created a Symfony demo application, edit the `templates/default/homepage.html.twig` template and make the following change:

```html {location="templates/default/homepage.html.twig"}
{% block body %}
    <div class="page-header">
-        <h1>{{ 'title.homepage'|trans|raw }}</h1>
+        <h1>Welcome to the Platform.sh Demo</h1>
    </div>

    <div class="row">
```

Commit the change:
```bash
git commit -a -m "Update text"
```

And deploy the change to the `feat-a` environment:

```bash
git push --set-upstream origin feat-a
```
Through the integration process, this will activate a related environment on Platform.sh.
If you have some services enabled, the new environment inherits the data of the parent environment (the production one here).

Browse the new version and notice that the domain name is different now (each environment has its own domain name):

```bash
symfony cloud:url --primary
```

Iterate by changing the code, committing, and deploying. When satisfied with the changes, merge it to main, deploy, and remove the feature branch:

```bash
git checkout main
git merge feat-a
git push origin main
git branch -d feat-a
git push origin --delete feat-a
symfony environment:delete feat-a
```

{{< note >}}
Note that deploying production was fast as it reused the image built for the feat-a environment.
{{< /note >}}

For a long running branch, you can keep the code up-to-date with main via `git merge main` or `git rebase main`. And you can also keep the data in sync with the production environment via `symfony env:sync`.
