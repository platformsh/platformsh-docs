# Platform Drush Aliases

The [Platform.sh CLI](https://github.com/platformsh/platformsh-cli)
generates and maintains Drush Aliases that allow you to issue remote
Drush commands on any environment (branch) that is running on
Platform.sh. There is also a Drush Alias for your local site.

To see your Drush Aliases, use the `platform drush-aliases` command:

```bash
$ platform drush-aliases
Aliases for My Site (tqmd2kvitnoly):
    @tqmd2kvitnoly._local
    @tqmd2kvitnoly.master
    @tqmd2kvitnoly.staging
    @tqmd2kvitnoly.sprint1
```

> **note**

> Run local Drush commands with `drush`. Run remote Drush commands with
> `platform drush`. Any `platform drush` command will execute on the
> remote environment that you currently have checked out.

## Change the Drush Alias Group

You can set the Drush alias group name to something more convenient:

```bash
platform drush-aliases -g [alias group]
```

After that, they will be easier to remember and type.

```bash
$ platform drush-aliases -g mysite
Project aliases created, group: @mysite
Delete old alias group @tqmd2kvitnoly? [Y/n] Y
Aliases for My Site (tqmd2kvitnoly):
    @mysite._local
    @mysite.master
    @mysite.staging
    @mysite.sprint1
```