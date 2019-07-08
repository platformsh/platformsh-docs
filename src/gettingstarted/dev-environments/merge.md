# Development Environments

## Merge into production

Now that you've had the chance to verify that your application built and deployed correctly on your development environment, you're ready to merge it into your production site. Platform.sh provides [snapshot](/administration/snapshot-and-restore.md) features that protect against any unforeseen consequences of your merges, keeping a historical copy of all of your code and data.

<asciinema-player src="/videos/asciinema/snap-merge-restore.cast" preload=1></asciinema-player>

> **Note:** The `--project` flag is not needed if you are running the `platform` command from within your local repository.

1. **Create a snapshot**

    Before you merge the `dev` feature into `master`, create a [snapshot](/administration/snapshot-and-restore.md) of the `master` environment. The snapshot will preserve both the code and all of its data.

    ```bash
    platform snapshot:create --project <project id>
    ```

    Select `master` as the environment you want to back up.

2. **Merge feature into production**

    ```bash
    git checkout master
    platform merge --project <project id>
    ```

    Select `dev`, and then Platform.sh will merge `dev` into its parent, `master`. When the build process completes, verify that your changes have been merged.

    ```bash
    platform url
    ```

3. **Restore a snapshot**

    If you would like to restore the code and data to the time of your snapshot, use the command

    ```bash
    platform snapshot:restore --project <project id>
    ```

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have merged the new feature</a>
</div>
