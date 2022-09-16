---
title: "Merge into production"
weight: 3
toc: false
aliases:
  - "/gettingstarted/dev-environments/merge.html"
---

Now that you've had the chance to verify that your application built and deployed correctly on your development environment, you're ready to merge it into your production site. Platform.sh provides [backup](/administration/backup-and-restore.md) features that protect against any unforeseen consequences of your merges, keeping a historical copy of all of your code and data.

{{< asciinema src="videos/asciinema/snap-merge-restore.cast" >}}

{{< note >}}
The `--project` flag isn't needed if you are running the `platform` command from within your local repository.
{{< /note >}}


1. **Create a backup**

    Before you merge the `dev` feature into your production environment,
    create a [backup](/administration/backup-and-restore.md) of the production environment.
    The backup preserves both the code and all of its data.

    ```bash
    platform backup --project <PROJECT_ID> -e <ENVIRONMENT_NAME>
    ```

    Make sure to specify your production environment's name.

2. **Merge feature into production**

    ```bash
    git checkout main
    git merge dev
    git push
    ```

    When the build process completes, verify that your changes have been merged.

    ```bash
    platform url
    ```

3. **Restore a backup**

    If you would like to restore the code and data to the time of your backup, use the command

    ```bash
    platform backup:restore --project <project id>
    ```

{{< guide-buttons next="I've merged the new feature" >}}
