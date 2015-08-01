# Use private Git repository

## Pull code from a private Git repository

Let's say you're building a module (*or theme, library...*) which is
stored in a private Git repository that you have access to and want to
use it on your project.

Platform allows you to get code that is stored in private Git repository
(from your make file, or `composer file`).

To grant Platform access to your private Git repository, you need to add
the project public SSH key in the deploy keys of your Git repository.

You can find your project's public key by going to the project's configuration
on the Web Interface and copy it from there:

![Deploy Key](/images/deploykey.png)

If your private repository is on GitHub, go to the target repository's
settings page. Go to *Deploy Keys* and click *Add deploy key*. Paste the
public SSH key in and submit. By default, on github, deploy keys are read only
so you do not need to worry about the system pushing code to the private
repository.

If you're using Drupal for example, you can now use your private module
by adding it to your make file:

```ini
; Add private repository from GitHub
projects[module_private][type] = module
projects[module_private][subdir] = "contrib"
projects[module_private][download][type] = git
projects[module_private][download][branch] = dev
projects[module_private][download][url] = "git@github.com:guguss/module_private.git"
```

> **note**
> In the make file use the `<user>@<host>:<path>.git` format, or `ssh://<user>@<host>:<port>/<path>.git` if using a non-standard port.

## Using multiple private Git repositories

GitHub only allow you to use a deploy key to a single repository. More
complex projects may have many repositories to pull to the same server.

If your project needs to access multiple repositories, you can choose to
attach an SSH key to an automated user account. Since this account won’t
be used by a human, it’s called a machine user. You can then add the
machine account as collaborator or add the machine user to a team with
access to the repositories it needs to manipulate.

More information about this on
[GitHub](https://developer.github.com/guides/managing-deploy-keys/#machine-users).

