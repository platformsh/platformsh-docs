---
title: "Use a third-party Git provider"
weight: -50
description: "Link your Symfony app to an existing third-party Git provider."
---

When you choose to use a third-party Git hosting service,
the Platform.sh Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third-party repository.

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

{{< note title="Tip" >}}

You can purchase additional development environments at any time in the [Web Console](/administration/web/_index.md).

To do so, open your project and select **Edit plan**.
Add additional **Environments**, view a cost estimate, and confirm your changes.

{{< /note >}}

{{% guides/deployment Symfony=true %}}

## Deploy your project

For the integration to automatically deploy your Git branch to the corresponding environment,
push your code to your Git repository:

```bash
git push origin
```

## Make changes to your project

Now that your project is deployed, you can start making changes to it. For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment. Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash
   git checkout main
   git checkout -b feat-a```

   This command creates a new local `feat-a` Git branch based on the main Git branch and activates a related environment on Platform.sh.

2. Make changes to your project.

   For example,  if you created a Symfony Demo app,
   edit the `templates/default/homepage.html.twig` template and make the following visual changes:

   ```html {location="templates/default/homepage.html.twig"}
   {% block body %}
       <div class="page-header">
   -        <h1>{{ 'title.homepage'|trans|raw }}</h1>
   +        <h1>Welcome to the Platform.sh Demo</h1>
       </div>

       <div class="row">
   ```

3. Commit your changes:

   ```bash
   git commit -a -m "Update text"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash
   git push --set-upstream origin feat-a
   ```

   A related environment on Platform.sh is activated through the integration process.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

   {{< note >}}

   Each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash
   symfony cloud:url --primary
   ```

   {{< /note >}}

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy, and remove the feature branch:

   ```bash
   git checkout main
   git merge feat-a
   git push origin main
   git branch -d feat-a
   git push origin --delete feat-a
   symfony environment:delete feat-a
   ```

   {{< note >}}

   Deploying to production was fast because the image built for the `feat-a` environment was reused.

   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the production environment by using `symfony env:sync`.