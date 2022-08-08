---
title: "Technical Requirements: Git and SSH"
weight: 2
sidebarTitle: "Tools"
---

## Git

Git is the open source version control system that is utilized by Platform.sh.

Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an environment in the activity feed of the Console.

Before getting started, make sure you have it installed on your computer to be able to interact with Platform.sh.

{{< note title="See also">}}
* [Install Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
* [Learn more about Git](https://git-scm.com/)
{{< /note >}}

## SSH

Secure Shell (SSH) is a secure, encrypted connection between your computer and the Platform.sh environment.  That includes connecting to your Git repository.  SSH offers two secure types of authentication, based on keys or certificates.  We support both.

Certificates are used automatically when you use the [Platform.sh CLI](../administration/cli/_index.md) and run almost any command.  You may force a login using `platform login -f` on the command line, provided you have a web browser available.

To use key pairs, see the [SSH keys](./ssh/ssh-keys.md).
