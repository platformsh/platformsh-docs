# Development Environments

## Create environment

It would be useful to test a new feature deploys correctly by building a live site of your application that includes that feature. Platform.sh supports the deployment of isolated development environments from your branches, complete with exact copies of all of your data.

This is a simple example of how to set up a development environment, but if any of your features depend on the data inside your production databases, you will have full access to a complete copy of that data so that you can be sure the feature will work as expected before merging.

<asciinema-player src="/videos/asciinema/branch.cast" preload=1 autoplay=1 loop=1></asciinema-player>

1. **Create branch, make changes, push to Platform.sh**

    First, create and checkout a branch for your new feature.

    ```bash
    git branch dev && git checkout dev
    ```

    Make some changes to your code, commit them and push to the Platform.sh remote.

    ```bash
    git add .
    git commit -m "Commit message."
    git push platform dev
    ```

2. **Activate an environment for the feature branch**

    Platform.sh will create a new environment from the branch, but it will not be active. That is, it will not be built and deployed into a live environment. You can check the status of an inactive environment after you push the branch with the command

    ```bash
    platform environments -p <project ID>
    ```

    To activate the new branch `dev` from within your local repository, use the command

    ```bash
    platform environment:activate dev
    ```

3. **Verify**

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
