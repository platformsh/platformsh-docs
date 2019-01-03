# Using Git submodules

## Clone submodules during deployment

Platform.sh allows you to use submodules in your Git repository. They are usually listed in a `.gitmodules` file at the root of your Git repository. When you push via Git, Platform.sh will try to clone them automatically.

Here is an example of a `.gitmodules` file:

```ini
[submodule "app/Oro"]
	path = src/Oro
	url = https://github.com/orocrm/platform.git
[submodule "src/OroPackages/src/Oro/Bundle/EntitySerializedFieldsBundle"]
	path = src/OroPackages/src/Oro/Bundle/EntitySerializedFieldsBundle
	url = https:/github.com/orocrm/OroEntitySerializedFieldsBundle.git
[submodule "src/OroB2B"]
	path = src/OroB2B
	url = https://github.com/orocommerce/orocommerce.git
```

When you run `git push`, you can see the output of the log:

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

Since the Platform.sh Git server cannot connect to Github via SSH without being granted an SSH key to do so, you should not be using an SSH URL: `git@github.com:...`, but you should use an HTTPS URL instead: `https://github.com/...`.
