# Development Environments

## Create environment

It would be useful to test a new feature deploys correctly by building a live site of your application that includes that feature. Platform.sh supports the deployment of isolated development environments from your branches, complete with exact copies of all of your data.

This is a simple example of how to set up a development environment, but if any of your features depend on the data inside your production databases, you will have full access to a complete copy of that data so that you can be sure the feature will work as expected before merging.

<asciinema-player src="/videos/asciinema/branch.cast" preload=1 autoplay=1 loop=1></asciinema-player>

1. **Create branch, make changes, push to Platform.sh**

    Using the CLI, create a branch for a new feature called `dev`

    ```
    platform environment:branch dev
    ```

    This command will create a new branch `dev` from `master`, as well as a local `dev` branch for you to work on. `dev` will be a clone of `master`, including an exact-copy of all of its data and files.

    Make some changes to your code, commit them and push to the Platform.sh remote.

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

Now that you have a live development environment to test, you're ready to merge it into production. Before you do that, however, it's always a good idea to take a [snapshot](/administration/snapshot-and-restore.md) of your `master` environment in case you want to restore that snapshot post-merge.

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navNextText = "I have created and activated a development environment";
  var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
  makeButton(navButtons);
});
</script>
