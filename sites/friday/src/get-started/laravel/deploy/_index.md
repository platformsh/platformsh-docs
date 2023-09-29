---
title: Guide to Deploying Laravel on {{< vendor/name >}}
sidebarTitle: Get started
weight: -110
layout: single
description: |
  Create a {{< vendor/name >}} account, download a few tools, and prepare to deploy Laravel.
---

[Laravel](https://laravel.com) is an open-source PHP Framework.

{{< note title=”tip” >}}

To get your Laravel project up and running as quickly as possible, experiment with the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project/demo) before following this guide.

{{< /note >}}

{{% guides/requirements %}}

## Initialize a project

You can start with a basic code base or push a pre-existing project to {{< vendor/name >}}.

1. Get your code ready locally.

If your code lives in a remote repository, clone it to your computer.

If your code isn't in a Git repository, initialize it by running `git init`.

{{< note >}}

We recommend you initialize a Git repository **before** creating an
{{< vendor/name >}} project as this one will then yout main environment track
your main branch. Otherwise, the main environment might track a `main` branch
while your default branch may be `master` and therefore handled as a secondary
environment.

{{< /note >}}

2. Create your first {{< vendor/name >}} project by running the following command:

```bash
{{< vendor/cli >}} project:create
```

Then choose the region you want to deploy to, such as the one closest to your site visitors.
You will explicitely configure the [resource allocation](/manage-resources.md)
for your project at a later step.

Copy the ID of the project you've created.

3. Connect your {{< vendor/name >}} project with Git.
You can use {{< vendor/name >}} as your Git repository or connect to a
[third-party provider](##using-a-third-party-provider): GitHub, GitLab, or BitBucket.

### Using {{< vendor/name >}}

The `{{< vendor/cli >}} project:create` interactive command asked
```bash
Set the new project <YOUR PROJECT NAME> as the remote for this repository? [y/N]
```

Run the following command from your repository if you had chosen `no` at this step,
but wish to add a Git remote for the {{< vendor/name >}} project you just created:

```bash
{{< vendor/cli >}} project:set-remote PROJECT_ID
```

That creates an upstream called `{{< vendor/cli >}}` for your Git repository.


### Using a third-party provider

When you choose to use a third-party Git hosting service the {{< vendor/name >}}
Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third party repository.

The process varies a bit for each supported service, so check the specific pages for each one.

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Accept the default options or modify to fit your needs.

All of your existing branches are automatically synchronized to {{< vendor/name >}}.
You get a deploy failure message because you haven't provided configuration files yet.
You add them in the next step.

If you're integrating a repository to {{< vendor/name >}} that contains a number of open pull requests,
don't use the default integration options.

Instead, each service integration should be made with the following flag:

```bash
{{< vendor/cli >}} integration:add --type=<service> ... --build-pull-requests=false
```

You can then go through this guide and activate the environment when you're ready to deploy.

Now you have a local Git repository, a {{< vendor/name >}} project,
and a way to push code to that project. Next you can configure your project to
work with {{< vendor/name >}}.</p>

{{< guide-buttons next="Configure Laravel" type="first" >}}
