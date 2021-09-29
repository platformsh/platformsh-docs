---
title: "Troubleshooting"
description: |
  Source integration troubleshooting
---

{{< description >}}

##Troubleshooting while cloning the repository

When you set up an `[external integration](https://docs.platform.sh/integrations/source.html)` to GitHub, GitLab, or Bitbucket, an additional layer of access control gets added.

###Example
If you invite a user with Project Administrator role to a project on Platform.sh, but you haven’t invited them to the remote repository on GitHub/ GitLab/Bitbucket, they won't be able to clone the project locally.

In the following example, using either platform get with the CLI:
``$ platform get <projectID>``
or the git clone command visible from the “Git” dropdown in the management console
``$ git clone git@github.com:user/github-repo.git Project Name``
both would error with
``Failed to connect to the Git repository: git@github.com:user/github-repo.git``

###Solution 1 (Recommended)
Ensure you have the correct access rights for the external integration repository.


###Solution 2
Clone the repository from Platform.sh, which is a repository is an read-only mirror of the external integration repository.

```bash
$ git clone <project>@git.<region>.platform.sh:<project>.git
```

{{< note theme="warning" title="Warning" >}}

Changes pushed to the Platform.sh mirror repository will be overwritten when other changes are pushed to the external integration repository.

{{< /note >}}
