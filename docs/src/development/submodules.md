---
title: "Using Git submodules"
weight: 11
sidebarTitle: "Git submodules"
---

## Clone submodules during deployment

Platform.sh allows you to use submodules in your Git repository. They're usually listed in a `.gitmodules` file at the root of your Git repository. When you push via Git, Platform.sh tries to clone them automatically.

Here is an example of a ``.gitmodules`` file:

```ini
[submodule "app/Oro"]
	path = src/Oro
	url = https://github.com/orocrm/platform.git
[submodule "src/OroPackages/src/Oro/Bundle/EntitySerializedFieldsBundle"]
	path = src/OroPackages/src/Oro/Bundle/EntitySerializedFieldsBundle
	url = https://github.com/orocrm/OroEntitySerializedFieldsBundle.git
[submodule "src/OroB2B"]
	path = src/OroB2B
	url = https://github.com/orocommerce/orocommerce.git
```

When you run ``git push``, you can see the output of the log:

```bash
Validating submodules.
  Updated submodule git://github.com/orocommerce/orocommerce: 4 references updated.
  Updated submodule git://github.com/orocrm/platform: 229 references updated.
  Updated submodule git://github.com/orocrm/OroEntitySerializedFieldsBundle: 11 references updated.
```

## Error when validating submodules

If you see the following error:

```bash
Validating submodules.
  Found unresolvable links, updating submodules.

E: Error validating submodules in tree:
    - /src/Oro: Exception: commit 03567c6 not found.

   This might be due to the following errors fetching submodules:
    - git@github.com:orocommerce/orocommerce.git: HangupException: The remote server unexpectedly closed the connection.
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
    ```

    Change this to the following:

    ```bash {location=".gitmodules"}
    [submodule "support/module"]
        path = support/module
        url = git@bitbucket.org:username/module.git
    ```

2. Add the [project's public key to your remote Git repository](./private-repository.md).
   This allows your Platform.sh project to pull the repository from the remote Git service.

## Removing submodules

These steps aren't specific to Platform.sh, but kept as a reference for Git so that submodules are effectively removed before entering the build process.

1. Delete information for the submodule you'd like to remove from `.gitmodules`.
2. Stage changes to `.gitmodules`: 

    ```bash
    $ git add .gitmodules
    ```

3. Remove the submodule configuration from `.git/config`.
4. Remove the submodule from the repository (without trailing slash): 

    ```bash
    $ git rm --cached path_to_submodule
    ```

5. Remove the submodule files in `.git` from the repository  (without trailing slash): 

    ```bash
    $ rm -rf .git/modules/path_to_submodule
    ```

6. Commit the changes: 

    ```bash
    $ git commit -m "Removed submodule."
    ```

7. Remove the submodule code locally, now no longer tracked: 

    ```bash
    $ rm -rf path_to_submodule
    ```

{{< note title="Credit" theme="info" >}}
Original can be found in a [gist by Mahdi Yusuf](https://gist.github.com/myusuf3/7f645819ded92bda6677), replicated here for internal linking.
{{< /note >}}
