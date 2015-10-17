# Platform Drush Aliases

The [Platform.sh CLI](https://github.com/platformsh/platformsh-cli)
generates and maintains Drush Aliases that allow you to issue remote
Drush commands on any environment (branch) that is running on
Platform.sh. There is also a Drush Alias for your local site.

To see your Drush Aliases, use the `platform drush-aliases` command:

```bash
$ platform drush-aliases
Aliases for My Site (tqmd2kvitnoly):
    @my-site._local
    @my-site.master
    @my-site.staging
    @my-site.sprint1
```

> **note**

> Run local Drush commands with `drush`. Run remote Drush commands with
> `platform drush`. Any `platform drush` command will execute on the
> remote environment that you currently have checked out.

## Change the Drush alias group

You can set the Drush alias group name to something else, if you prefer:

```bash
platform drush-aliases -g [alias group]
```

For example:

```bash
$ platform drush-aliases -g example
Project aliases created, group: @example
Delete old alias group @my-site? [Y/n] Y
Aliases for My Site (tqmd2kvitnoly):
    @example._local
    @example.master
    @example.staging
    @example.sprint1
```
