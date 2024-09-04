---
title: "Use Git submodules"
weight: 11
sidebarTitle: "Git submodules"
---

## Clone submodules during deployment

{{% vendor/name %}} allows you to use submodules in your Git repository.
They're usually listed in a `.gitmodules` file at the root of your Git repository.
When you push via Git, {{% vendor/name %}} tries to clone them automatically.

{{% version/specific %}}
<!-- Platform.sh -->
The following example is based on [a Bigfoot multi-app project](https://github.com/platformsh-templates/bigfoot-multiapp/tree/multiapp-subfolders-applications) which uses the following submodules:

- A [BigFoot app](https://github.com/platformsh-templates/bigfoot-multiapp-api/tree/without-platform-app-yaml)
- An [API Platform v3, Admin component](https://github.com/platformsh-templates/bigfoot-multiapp-admin/tree/without-platform-app-yaml)
- A [Gatsby frontend](https://github.com/platformsh-templates/bigfoot-multiapp-gatsby/tree/without-platform-app-yaml)
- A [Mercure Rocks server](https://github.com/platformsh-templates/bigfoot-multiapp-mercure/tree/without-platform-app-yaml)

![Diagram of a project containing multiple apps](/images/config-diagrams/multiple-app.png "0.5")
<--->
<!-- Upsun -->
Say you have a multi-app project that includes the following submodules:

- A BigFoot app
- An API Platform v3, Admin component
- A Gatsby frontend
- A Mercure Rocks server

{{% /version/specific %}}

To import all the submodules, run the following commands from your multiple application project's root folder:

```bash
touch .gitmodules
git submodule add --name admin https://github.com/platformsh-templates/bigfoot-multiapp-admin.git admin
git submodule add --name api https://github.com/platformsh-templates/bigfoot-multiapp-api.git api
git submodule add --name gatsby https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git gatsby
git submodule add --name mercure https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git mercure
git add .
git commit -m "Adding submodules for Bigfoot App, API Platform Admin, Gatsby frontend and Mercure Rocks server"
git push
```

Here is an example of a `.gitmodules` file:

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

When you run `git push`, you can see the output of the logs:

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

If your submodule contains an independent app,
see [how to configure it properly](create-apps/multi-app/project-structure.md#split-your-code-source-into-multiple-git-submodule-repositories).

{{< /note >}}

## Update submodules

{{< codetabs >}}
+++
title= Manual update
+++

When you amend your submodules' code, make sure your changes are applied by running the following commands
before redeploying:

```bash
git submodule update --remote [submodule]
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
title= Automated update
+++

{{< note theme="warning" title="Tier availability" version="1" >}}

This feature is available for **Elite** and **Enterprise** customers.
[Compare the {{% vendor/name %}} tiers](https://platform.sh/pricing/) on our pricing page,
or [contact our Sales team](https://platform.sh/contact/) for more information.

{{< /note >}}

Automate your submodule updates using a [source operation](create-apps/source-operations).
To do so, follow these steps:

1. Define a source operation.</br>
   Add the following configuration to your `{{< vendor/configfile "app" >}}` file:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="false" >}}
source:
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
{{< /snippet >}}
```

   For multiple app projects, make sure you define your source operation
   in the configuration of an app whose source code **is not** in a submodule.

   If you use [Git submodules for each of your apps](/create-apps/multi-app/project-structure.md#split-your-code-source-into-multiple-git-submodule-repositories), define a new app at the top level of your project repository.
   Don't define routes so your app isn't exposed to the web.
   To define a source operation, add the following configuration to your [app configuration](/create-apps/app-reference):

```yaml {configFile="app"}
{{< snippet name="update-submodule" config="app" root="false" >}}
# The type of the application to build.
type: 'nodejs:{{% latest "nodejs" %}}'

# The web key configures the web server running in front of your app.
web:
# Commands are run once after deployment to start the application process.
  commands:
    # The command to launch your app. If it terminates, it’s restarted immediately.
    # As this app will handle source operation only, no need to keep it alive (sleep)
    start: |
      sleep infinity
source:
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
{{< /snippet >}}
```

2. Run your source operation.</br>

   To do so, in the [Console](../administration/web/_index.md),
   navigate to the environment where you want to run the source operation.</br>
   Click {{< icon more >}} **More**.</br>
   Click **Run Source Operation**.</br>
   Select the operation you want to run.</br>
   Click **Run**.

   Alternatively, to run your source operation from the [{{% vendor/name %}} CLI](../administration/cli/_index.md),
   run the following command:

   ```bash
   {{% vendor/cli %}} source-operation:run {{< variable "SOURCE_OPERATION_NAME" >}}
   ```

{{< /codetabs >}}

## Error when validating submodules

Using an SSH URL (`git@github.com:...`) to fetch submodules triggers the following error:

```bash
Validating submodules.
  Found unresolvable links, updating submodules.

E: Error validating submodules in tree:
    - admin: Exception: commit 03567c6 not found.

   This might be due to the following errors fetching submodules:
    - git@github.com:platformsh-templates/bigfoot-multiapp-admin.git: HangupException: The remote server unexpectedly closed the connection.
```

This is due to the fact that the {{% vendor/name %}} Git server can't connect to GitHub via SSH without being granted an SSH key to do so.
To solve this issue, use an HTTPS URL (`https://github.com/...`) instead.

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
   This allows your {{% vendor/name %}} project to pull the repository from the remote Git service.

{{< note >}}

Deploy keys only grant access to a single repository,
which can cause issues when attempting to pull several repositories to the same server.
If your server needs access to multiple repositories, follow these steps:

1. [Create a machine user](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#machine-users)
   with access rights to each of the private repositories.
2. Attach the deploy key to your machine user.

{{< /note >}}

## Removing submodules

These steps aren't specific to {{% vendor/name %}}, but kept as a reference for Git so that submodules are effectively removed before entering the build process.

1. In your `.gitmodules` and `.git/config` files, delete the information related to the submodule you want to remove.

   ```bash
   git submodule deinit -f path_to_submodule
   ```

2. Stage changes to `.gitmodules`:

    ```bash
    git add .gitmodules
    ```
3. Remove the submodule from the repository (without trailing slash):

    ```bash
    git rm --cached path_to_submodule
    ```

4. Remove the submodule files in `.git` from the repository  (without trailing slash):

    ```bash
    rm -rf .git/modules/path_to_submodule
    ```

5. Commit the changes:

    ```bash
    git commit -m "Removed submodule."
    ```

6. Remove the submodule code locally, now no longer tracked:

    ```bash
    rm -rf path_to_submodule
    ```
