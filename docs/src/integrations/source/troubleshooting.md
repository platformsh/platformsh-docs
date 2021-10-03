---
title: "Troubleshooting"
description: |
  Troubleshooting source integrations.
---

{{< description >}}

## Errors when cloning a repository

If you invite a user with Project Administrator role to a project on Platform.sh, but you haven’t invited them to the remote repository on GitHub/ GitLab/Bitbucket, they won't be able to clone the project locally.

In the following example, using either `platform get` with the CLI:
```
$ platform get <projectID>
```
or the `git clone` command visible from the **Git** dropdown in the management console

```
$ git clone git@github.com:user/github-repo.git Project Name
```

both would error with

```
Failed to connect to the Git repository: git@github.com:user/github-repo.git
Please make sure you have the correct access rights and the repository exists.
```

### Solution 1 (Recommended)

Ensure you have the correct access rights for the external integration repository.

### Solution 2

Clone the repository from Platform.sh, which offers a read-only mirror repository of the external integration repository.

```bash
$ git clone <PROJECT_ID>@git.<REGION>.platform.sh:<PROJECT_ID>.git
```

{{< note theme="Warning" >}}

Changes pushed to the Platform.sh mirror repository are overwritten when other changes are pushed to the external integration repository. This method works to clone the repository, but you shouldn't rely on it for making changes.

{{< /note >}}
