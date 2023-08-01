---
title: "Keep your Git repository clean"
weight: 3
description: To avoid performance issues, keep your Git repository clean and prevent it from becoming too large.
keywords:
  - Console unavailable
  - can't access Console
  - can't access project
  - Git repository
  - clean repository
  - dirty repository
  - performance issues
  - latencies
  - prune branches
  - remove branches
---

When a Git repository contains a high number of references and files, Git's performance can decrease.
This is why most Git providers have repository size limits in place (for more information, see the [GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), [GitLab](https://docs.gitlab.com/ee/user/gitlab_com/index.html#account-and-limit-settings)
and [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/reduce-repository-size/) documentation).

The Platform.sh API and [Console](../administration/web/_index.md) are closely tied to Git.
When Git's performance decreases, Platform.sh API servers also become slower.
As a user, you can then experience significant latencies.
If you repository becomes too large, your Console may even become unresponsive,
leaving you unable to access your project.

To avoid such issues, make sure you keep your Git repository clean by following the instructions on this page.

If you're already facing performance issues and suspect they might be related to the size of your Git repository,
see how you can [troubleshoot a sizeable Git repository](#troubleshoot-a-sizeable-git-repository).

## Enable the automated pruning of old branches in your project

To keep your repository size to a minimum,
make sure that branches that don't exist anymore in your repository have also been deleted from Platform.sh.

To automate this process, when setting up a [source integration](../integrations/_index.md),
enable the `prune-branches` option.

If you already have a source integration set up and want to enable the `prune-branches` option,
follow these steps:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. To enable the `prune-branches` option, you must first enable the `fetch-branches` option.
   To do so, run the following command: 

   ```bash
   platform integration:update --project {{< variable "PROJECT_ID" >}} {{< variable "SOURCE_INTEGRATION_ID" >}} --fetch-branches true
   ```

2. Then, to enable the `prune-branches` option, run the following command:

   ```bash
   platform integration:update --project {{< variable "PROJECT_ID" >}} {{< variable "SOURCE_INTEGRATION_ID" >}} --prune-branches true
   ```
<--->

+++
title=In the Console
+++

1. Navigate to your project.
2. Click {{< icon settings >}} **Settings**.
3. Click **Project Settings**.
4. Click **Integrations** and select your source integration.
5. Click **Edit**.
6. Enter your access token and click **Continue**.
7. Select your repository and check the following boxes:
   - **Fetch branches from the remote repository to your project** (`fetch-branches` option, mandatory to enable `prune-branches`).
   - **Remove branches from your project that have disappeared remotely (requires the fetch branches option to be enabled)** (`prune-branches` option).
8. Click **Save**.

{{< /codetabs >}}


## Upload your files through mounts

Keeping too many files, especially large binary files, in your Git repository can cause performance and stability issues.
Therefore, Platform.sh recommends that you only commit your source code in Git.

To upload any other files to your app, [create mounts](https://docs.platform.sh/create-apps/app-reference.html#mounts)
and [transfer your files directly to them](https://docs.platform.sh/development/file-transfer.html#transfer-a-file-to-a-mount).

## Troubleshoot a sizeable Git repository

To check if your repository needs cleaning up, run the following command:

```bash
$ platform project:curl -p PROJECT_ID | jq '.status'
```

If you get the following output, make sure you clean your repository:

```bash
{
  "code": "provisioned",
  "message": "dirty"
}
```

To do so, follow these instructions:

1. Remove old, unwanted files from your repository (especially large files).
   You can do it manually, or use a tool such as [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/).
2. Remove stale branches from your repository and Platform.sh project.
3. Rebase and/or squash commits to clean up your history.
4. Run `$ platform project:curl -p PROJECT_ID | jq '.status'` again to check the state of your repository.
   Once your repository is clean, you get the following output:

   ```bash
   {
     "code": "provisioned",
     "message": "ok"
   }
   ```

After you've successfully cleaned up your repository,
make sure you [enable the automated pruning of old branches in your project](#enable-the-automated-pruning-of-old-branches-in-your-project)
and [upload your files through mounts](#upload-your-files-through-mounts) to avoid facing the same situation in the future.