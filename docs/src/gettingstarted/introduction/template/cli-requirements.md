---
title: "Next Steps: Requirements for the CLI"
weight: 4
sidebarTitle: "Requirements for the CLI"
toc: false
aliases:
  - "/gettingstarted/template/cli-requirements.html"
---

With the [management console]({{< relref "/administration/web/_index.md" >}}) you can start new projects from templates just as you did in the previous steps, but deploying your own applications requires you to also use the [Platform.sh CLI]({{< relref "/development/cli/_index.md" >}}).

Before you install it there are a few requirements that must be met first.

## Git

[Git]({{< relref "/development/tools.md#git" >}}) is the open source version control system used by Platform.sh. Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an environment in the `Environment Activity` feed of the [management console]({{< relref "/administration/web/_index.md" >}}) for each project you create.

Before getting started, make sure you [have Git installed](https://git-scm.com/) on your computer.

## SSH

You will need Secure Shell (SSH) to securely connect to your Git repository and environments.  SSH clients are readily available for every platform, and may already be installed on your computer.

Platform.sh supports both keypair-based and certificate-based authentication.  Both are secure and protect your account from snooping when you log in.  For now, you can use certificate-based authentication as that is easier.  You will be prompted to login via your web browser the first time you run `platform ssh`.  If you wish to use keypair authentication, see the [SSH page]({{< relref "/development/ssh.md" >}}) before continuing.

{{< guide-buttons next="I have Git and SSH ready" >}}
