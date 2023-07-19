---
title: "Using Git submodules"
weight: 11
sidebarTitle: "Git submodules"
---

## Clone submodules during deployment

Platform.sh allows you to use submodules in your Git repository.
They're usually listed in a `.gitmodules` file at the root of your Git repository.
When you push via Git, Platform.sh tries to clone them automatically.

### Clone submodules
In this example, inspiration comes from [this Bigfoot multi-app example](https://github.com/platformsh-templates/bigfoot-multiapp/tree/multiapp-subfolders-applications), using submodules:

- [BigFoot app](https://github.com/platformsh-templates/bigfoot-multiapp-api/tree/without-platform-app-yaml)
- [API Platform v3, Admin component](https://github.com/platformsh-templates/bigfoot-multiapp-admin/tree/without-platform-app-yaml)
- [Gatsby frontend](https://github.com/platformsh-templates/bigfoot-multiapp-gatsby/tree/without-platform-app-yaml)
- [Mercure Rocks server](https://github.com/platformsh-templates/bigfoot-multiapp-mercure/tree/without-platform-app-yaml)

To import them, from your multiple application project root folder, run these commands:

```bash
$ touch .gitmodules
$ git submodule add --name admin -b without-platform-app-yaml https://github.com/platformsh-templates/bigfoot-multiapp-admin.git admin
$ git submodule add --name api -b without-platform-app-yaml https://github.com/platformsh-templates/bigfoot-multiapp-api.git api
$ git submodule add --name gatsby -b without-platform-app-yaml https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git gatsby
$ git submodule add --name mercure -b without-platform-app-yaml https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git mercure
$ git add .
$ git commit -m "Adding submodules for Bigfoot App, API Platform Admin component, Gatsby frontend and Mercure Rocks server"
$ git push
```

Here is an example of what your ``.gitmodules`` file should look like:

```ini
[submodule "admin"]
  path = admin
  url = https://github.com/platformsh-templates/bigfoot-multiapp-admin.git
  branch = without-platform-app-yaml
[submodule "api"]
  path = api
  url = https://github.com/platformsh-templates/bigfoot-multiapp-api.git
  branch = without-platform-app-yaml
[submodule "gatsby"]
  path = gatsby
  url = https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
  branch = without-platform-app-yaml
[submodule "mercure"]
  path = mercure
  url = https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
  branch = without-platform-app-yaml
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
If your submodule contains an independent app, please read the [Multi-app section](/create-apps/multi-app/project-structure#configuration-separate-from-code-git-submodules) of the doc.
{{< /note >}}

## Update submodules

{{< codetabs >}}

+++
title=Manual update
+++

After submodule code updates, deployment of the project does not automatically update submodules. To update them, run the following command:

```bash
$ git submodule update --remote [submodule]
  Submodule path 'admin': checked out 'a020894cf94de6e79748890c942206bc7af752af'
  Submodule path 'api': checked out 'dce6617cc2db159c1a871112909e9ea4121135ec'
  Submodule path 'gatsby': checked out '012ab16b05f474278ad0f9916e1cb94fc9df5ba4'
  Submodule path 'mercure': checked out '94ccae5055983004aa8ab2c17b1daabd0c0a4927'
```

{{< note >}}
You can specify which submodule needs to be updated replacing ``[submodule]`` by your submodule path.
{{< /note >}}



[//]: # ( )
[//]: # ( +++ )

[//]: # (title=using Source Operation)

[//]: # ( +++ )

[//]: # (You can use [Source Operation]&#40;create-apps/source-operations&#41; to ease updates of your submodules by adding this line of code into your `.platform.app.yaml` &#40;or `.platform/applications.yaml`&#41; file:)

[//]: # ( yaml )

[//]: # (source:)

[//]: # (    operations:)

[//]: # (        rebuild:)

[//]: # (            command: |)

[//]: # (                set -e)

[//]: # (                git submodule update --init --recursive)

[//]: # (                git submodule update --remote --checkout)

[//]: # (                git add admin api gatsby mercure)

[//]: # (                git commit -m "Updating submodules admin, api, gatsby and mercure")

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

[//]: # (TODO FHK : as i change the process command, i don't know if we need to keep this credit to Mahdi Yusuf)
[//]: # ({{< note title="Credit" theme="info" >}})

[//]: # (Original can be found in a [gist by Mahdi Yusuf]&#40;https://gist.github.com/myusuf3/7f645819ded92bda6677&#41;, replicated here for internal linking.)

[//]: # ({{< /note >}})
