---
title: "Use a private Git repository"
weight: 10
sidebarTitle: "Private repositories"
---

## Pull code from a private Git repository

Say you're building something that's stored in a private Git repository that you have access to
and you want to use it in your project.
Platform.sh allows you to include code dependencies that are stored in external private Git repositories.

To grant Platform.sh access to your private Git repository,
you need to add the project's public SSH key to the deploy keys of your Git repository.

To get your project's public key:

1. In the Console, open the project you want.
2. Click **{{< icon settings >}} Settings**.
3. Click **Deploy Key**.
4. Click **{{< icon copy >}} Copy**.

![Deploy Key](/images/management-console/settings-deploy-key.png "0.5")

Then add the key to your repository:

* [GitHub deploy keys](https://docs.github.com/en/developers/overview/managing-deploy-keys#deploy-keys) 
* [GitLab deploy keys](https://docs.gitlab.com/ee/user/project/deploy_keys/)
* [Bitbucket deployment keys](https://bitbucket.org/blog/deployment-keys)

Then you can use the key.
For example, with Drupal you can now use your private module by adding it to your make file:

```ini
; Add private repository from GitHub
projects[module_private][type] = module
projects[module_private][subdir] = "contrib"
projects[module_private][download][type] = git
projects[module_private][download][branch] = dev
projects[module_private][download][url] = "git@github.com:<REPOSITORY_PATH>.git"
```

In the make file, use the `<USER>@<HOST>:<PATH>.git` format or `ssh://<USER>@<HOST>:<PORT>/<PATH>.git` if using a non-standard port.

## Using multiple private GitHub repositories

More complex projects may have many repositories that they want to include,
but GitHub only allows you to associate a deploy key with a single repository.

If your project needs to access multiple repositories, you can choose to attach an SSH key to an automated user account.
Since this account isn't used by a human, it's called a machine user.
You can then add the machine account as collaborator
or add the machine user to a team with access to the repositories it needs to manipulate.

More information about this is available on [GitHub](https://docs.github.com/en/developers/overview/managing-deploy-keys#machine-users).
