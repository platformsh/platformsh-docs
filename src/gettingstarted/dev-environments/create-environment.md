# Development Environments

## Create environment

Platform.sh supports the deployment of isolated development environments from your branches, complete with exact copies of all of your data. This is useful for testing changes in isolation before merging them.


<asciinema-player src="/videos/asciinema/branch.cast" preload=1></asciinema-player>

1. **Create branch, make changes, push to Platform.sh**

    Create and checkout a branch for your new feature.

    ```
    platform branch dev
    ```

    This command will create a new branch `dev` from `master`, as well as a local `dev` branch for you to work on. `dev` will be a clone of `master`, including an exact-copy of all of its data and files.

    Make changes to your code, commit them, and push to the Platform.sh remote.

    ```bash
    git add .
    git commit -m "Commit message."
    git push platform dev
    ```

    > **Note:** If you create a new branch with Git (i.e. `git checkout -b new-feature`), when you push its commits to Platform.sh that branch will not automatically build. `new-feature` is an *inactive environment*, because Platform.sh does not assume that every branch should be associated with an active environment, since your plan will limit the number of active environments you are allowed.
    >
    > If you want to activate the `new-feature` environment after it has been pushed, you can do so with the command
    >
    > ```
    > platform environment:activate new-feature
    > ```

2. **Verify**

  After Platform.sh has built and deployed the environment, verify that it has been activated by visiting its new url:

  ```bash
  platform url
  ```

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have created and activated a development environment</a>
</div>
