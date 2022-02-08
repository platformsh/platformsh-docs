---
title: Troubleshoot source integrations
sidebarTitle: Troubleshoot
description: Learn how to troubleshoot problems related to access rights when cloning repositories.
---

## Unable to clone a repository

If you [add a user](/administration/users.md#add-a-user-to-a-project) to a project on Platform.sh,
but you haven’t added them to the remote repository on GitHub, GitLab, or Bitbucket,
they can't clone the project locally.

If that user tries to use `platform get` with the CLI:
```
$ platform get <projectID>
```
it returns the following error:

```
Failed to connect to the Git repository: git@github.com:user/github-repo.git
Please make sure you have the correct access rights and the repository exists.
```

### Solution: check external repository access rights

Ensure the user has the correct access rights for the external integration repository.
