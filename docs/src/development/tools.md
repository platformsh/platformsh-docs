---
title: "Technical Requirements: Git and SSH"
weight: 2
sidebarTitle: "Tools"
---

## Git

Git is the open source version control system that is utilized by Platform.sh.

Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an environment in the activity feed of the management console.

Before getting started, make sure you have it installed on your computer to be able to interact with Platform.sh.

{{< note title="See also">}}
* [Install Git](https://help.github.com/articles/set-up-git/)
* [Learn more about Git](https://git-scm.com/)
{{< /note >}}

## SSH

Secure Shell (SSH) is a secure, encrypted connection between your computer and the Platform.sh environment.  That includes connecting to your Git repository.  SSH offers two secure types of authentication, key-based and certificate-based.  We support both.

Certificate-based authentication will be used automatically when you use the [Platform CLI]({{< relref "/development/cli/_index.md" >}}) and run `platform ssh`.  You may force a login using `platform login -f` on the command line, provided you have a web browser available.

If you wish to use keypair authentication, see the [SSH page]({{< relref "/development/ssh.md#keypair-based-authentication" >}}).
