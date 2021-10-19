---
title: "Troubleshooting"
description: In this page you'll learn how to troubleshoot problems related to access rights when cloning repositories.
---

## Unable to clone a repository

If you [add a user](/administration/users.md#add-a-user-to-a-project) with the **Project Admin** or **Contributor** role to a project on Platform.sh,
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

### Check external repository access rights (recommended solution)

Ensure the user has the correct access rights for the external integration repository.

### Clone Platform.sh repository

Clone the repository from Platform.sh, which offers a read-only mirror repository of the external integration repository.

```bash
$ git clone <PROJECT_ID>@git.<REGION>.platform.sh:<PROJECT_ID>.git <PROJECT_NAME>
```
To find your variables, go to your console, choose the project and under **Overview**, check the panel with the variables. Note that the REGION id must be written in lower case. [Check the list](/development/public-ips.md) of regions.

{{< note theme="Warning" >}}

Changes pushed to the Platform.sh mirror repository are overwritten when other changes are pushed to the external integration repository. This method works to clone the repository, but you shouldn't rely on it for making changes.

{{< /note >}}
