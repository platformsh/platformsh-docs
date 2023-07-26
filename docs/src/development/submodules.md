---
title: "Using Git submodules"
weight: 11
sidebarTitle: "Git submodules"
---

## Clone submodules during deployment

Platform.sh allows you to use submodules in your Git repository.
They're usually listed in a `.gitmodules` file at the root of your Git repository.
When you push via Git, Platform.sh tries to clone them automatically.

The following example is based on [a Bigfoot multi-app project](https://github.com/platformsh-templates/bigfoot-multiapp/tree/multiapp-subfolders-applications) which uses the following submodules:

- A [BigFoot app](https://github.com/platformsh-templates/bigfoot-multiapp-api/tree/without-platform-app-yaml)
- An [API Platform v3, Admin component](https://github.com/platformsh-templates/bigfoot-multiapp-admin/tree/without-platform-app-yaml)
- A [Gatsby frontend](https://github.com/platformsh-templates/bigfoot-multiapp-gatsby/tree/without-platform-app-yaml)
- A [Mercure Rocks server](https://github.com/platformsh-templates/bigfoot-multiapp-mercure/tree/without-platform-app-yaml)

![Diagram of a project containing multiple apps](/images/config-diagrams/multiple-app.png "0.5")

To import them, from your multiple application project's root folder, run the following commands:

```bash
$ touch .gitmodules
$ git submodule add --name admin https://github.com/platformsh-templates/bigfoot-multiapp-admin.git admin
$ git submodule add --name api https://github.com/platformsh-templates/bigfoot-multiapp-api.git api
$ git submodule add --name gatsby https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git gatsby
$ git submodule add --name mercure https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git mercure
$ git add .
$ git commit -m "Adding submodules for Bigfoot App, API Platform Admin, Gatsby frontend and Mercure Rocks server"
$ git push
```

Here is an example of a ``.gitmodules`` file:

```ini
[submodule "admin"]
  path = admin
  url = https://github.com/platformsh-templates/bigfoot-multiapp-admin.git
[submodule "api"]
  path = api
  url = https://github.com/platformsh-templates/bigfoot-multiapp-api.git
[submodule "gatsby"]
  path = gatsby
  url = https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
[submodule "mercure"]
  path = mercure
  url = https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
```

When you run ``git push``, you can see the output of the log:

```bash
  Validating submodules
    Updating submodule ttps://github.com/platformsh-templates/bigfoot-multiapp-admin.git
    Updated submodule https://github.com/platformsh-templates/bigfoot-multiapp-admin.git: 549 references updated.
    Updating submodule ttps://github.com/platformsh-templates/bigfoot-multiapp-api.git
    Updated submodule https://github.com/platformsh-templates/bigfoot-multiapp-api.git: 898 references updated.
    Updating submodule https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
    Updated submodule https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git: 257 references updated.
    Updating submodule https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
    Updated submodule https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git: 124 references updated.
  ...
```

{{< note >}}
If your submodule contains an independent app, see [how to configure it properly](create-apps/multi-app/project-structure.md#split-your-code-source-into-multiple-git-submodule-repositories).
{{< /note >}}

## Update submodules

{{< codetabs >}}
+++
title=Manual update
+++

After submodule code updates, redeploying your project isn't always enough for the changes to be applied.
To make sure your submodules are updated, run the following commands:

```bash
$ git submodule update --remote [submodule]
  Submodule path 'admin': checked out 'a020894cf94de6e79748890c942206bc7af752af'
  Submodule path 'api': checked out 'dce6617cc2db159c1a871112909e9ea4121135ec'
  Submodule path 'gatsby': checked out '012ab16b05f474278ad0f9916e1cb94fc9df5ba4'
  Submodule path 'mercure': checked out '94ccae5055983004aa8ab2c17b1daabd0c0a4927'
```

{{< note >}}
To specify which submodule needs to be updated, replace `[submodule]` with your submodule path.
{{< /note >}}

<--->
+++
title=using Source Operation
+++

{{< note theme="warning" title="Warning" >}}
To be able to use [Source Operation](create-apps/source-operations), your project needs to be an [Enterprise](https://platform.sh/pricing) one. If not, please reach out to one of our sales to upgrade your project.
{{< /note >}}

You can use [Source Operation](create-apps/source-operations) to ease updates of your submodules.

To defined a source operation, add these lines of code into your `.platform/applications.yaml` (or `.platform.app.yaml`) file:

```yaml
app:
  ...
  source:
    ######################################################################################################################
    ##                                                                                                                  ##
    ## This source operation is part of the Platform.sh process of updating and maintaining our collection of           ##
    ## templates. For more information see https://docs.platform.sh/create-apps/source-operations.html and              ##
    ## https://github.com/platformsh/source-operations                                                                  ##
    ##                                                                                                                  ##
    ##                  YOU CAN SAFELY DELETE THIS COMMENT AND THE LINES BENEATH IT                                     ##
    ##                                                                                                                  ##
    ######################################################################################################################
    operations:
      rebuild:
        command: |
          set -e
          git submodule update --init --recursive
          git submodule update --remote --checkout
          git add admin api gatsby mercure
          if ! git diff-index --quiet HEAD; then
            git commit -m "Updating submodules admin, api, gatsby and mercure"
          fi
```

{{< note >}}
Source operation needs to be defined in an app which source code **is not** in a submodule.

If you're having a multiple application project, using [Git submodules for each of your apps](/create-apps/multi-app/project-structure.md#split-your-code-source-into-multiple-git-submodule-repositories), you need to define a new app at the top level project.
This new app would not be exposed to the web (no routes) and will define this source operation by adding these lines in your ``.platform/applications.yaml``

```yaml
update-submodule:
  # The type of the application to build.
  type: "nodejs:18"

  # The web key configures the web server running in front of your app.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#web
  web:
    # Commands are run once after deployment to start the application process.
    # More information: https://docs.platform.sh/create-apps/app-reference.html#web-commands
    commands:
      # The command to launch your app. If it terminates, it’s restarted immediately.
      # As this app will handle source operation only, no need to keep it alive (sleep)
      start: |
        sleep infinity
  # Information on the app's source code and operations that can be run on it.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#source
  source:
    ######################################################################################################################
    ##                                                                                                                  ##
    ## This source operation is part of the Platform.sh process of updating and maintaining our collection of           ##
    ## templates. For more information see https://docs.platform.sh/create-apps/source-operations.html and              ##
    ## https://github.com/platformsh/source-operations                                                                  ##
    ##                                                                                                                  ##
    ##                  YOU CAN SAFELY DELETE THIS COMMENT AND THE LINES BENEATH IT                                     ##
    ##                                                                                                                  ##
    ######################################################################################################################
    operations:
      update-submodules:
        command: |
          set -e
          git submodule update --init --recursive
          git submodule update --remote --checkout
          git add .
          if ! git diff-index --quiet HEAD; then
            git commit -m "Updating submodules"
          fi
          # "git push" is automatic at the end of this command
```
{{< /note >}}

To execute this source operation, from the console, navigate to the environment you want to run the operation, and in the top right corner, click on the More button (3 dots) and choose **Run Source Operation**.

![screenshot of source operation menu](/images/management-console/source-operation-menu-open.png "0.3")

Then click on the **Run** button.
If you’ve got more than one source operation defined in your source code, you need to select which one needs to be executed.

{{< /codetabs >}}

## Error when validating submodules

If you see the following error:

```bash
Validating submodules.
  Found unresolvable links, updating submodules.

E: Error validating submodules in tree:
    - admin: Exception: commit 03567c6 not found.

   This might be due to the following errors fetching submodules:
    - git@github.com:platformsh-templates/bigfoot-multiapp-admin.git: HangupException: The remote server unexpectedly closed the connection.
```

Since the Platform.sh Git server can't connect to GitHub via SSH without being granted an SSH key to do so, you shouldn't use an SSH URL: ``git@github.com:...``, but you should use an HTTPS URL instead: ``https://github.com/...``.

## Use private Git repositories

When using Git submodules that are private repositories, URLs with the HTTPS protocol fail with errors such as the following:

```bash
GitProtocolError: unexpected http resp 401 for https://bitbucket.org/myusername/mymodule.git/info/refs?service=git-upload-pack
```

To fix this, follow these steps:

1. Change your module declarations to use SSH for URLs.

    Your existing declaration might look like this:

    ```bash {location=".gitmodules"}
    [submodule "support/module"]
        path = support/module
        url = https://bitbucket.org/username/module.git
        branch = submodule/branch
    ```

    Change this to the following:

    ```bash {location=".gitmodules"}
    [submodule "support/module"]
        path = support/module
        url = git@bitbucket.org:username/module.git
        branch = submodule/branch
    ```

2. Add the [project's public key to your remote Git repository](./private-repository.md).
   This allows your Platform.sh project to pull the repository from the remote Git service.

{{< note >}}

Deploy keys only grant access to a single repository,
which can cause issues when attempting to pull several repositories to the same server.
If your server needs access to multiple repositories, follow these steps:

1. [Create a machine user](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#machine-users)
   with access rights to each of the private repositories.
2. Attach the deploy key to your machine user.

{{< /note >}}

## Removing submodules

These steps aren't specific to Platform.sh, but kept as a reference for Git so that submodules are effectively removed before entering the build process.

1. Delete information for the submodule you'd like to remove from `.gitmodules` and `.git/config`.

   ```bash
   $ git submodule deinit -f path_to_submodule
    ```

2. Stage changes to `.gitmodules`:

    ```bash
    $ git add .gitmodules
    ```
3. Remove the submodule from the repository (without trailing slash):

    ```bash
    $ git rm --cached path_to_submodule
    ```

4. Remove the submodule files in `.git` from the repository  (without trailing slash):

    ```bash
    $ rm -rf .git/modules/path_to_submodule
    ```

5. Commit the changes:

    ```bash
    $ git commit -m "Removed submodule."
    ```

6. Remove the submodule code locally, now no longer tracked:

    ```bash
    $ rm -rf path_to_submodule
    ```
