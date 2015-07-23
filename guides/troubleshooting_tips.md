# IDE Specific Tips

MAMP pro:

In order for MAMP to work well with the symlinks created by the
[Platform.sh CLI](https://github.com/platformsh/platformsh-cli), add the
following to the section under Hosts \> Advanced called “Customized
virtual host general settings.” For more details visit [MAMP Pro
documentation
page](http://documentation.mamp.info/en/documentation/mamp/).

```bash
<Directory>
        Options FollowSymLinks
        AllowOverride All
</Directory>
```

> [Laravel Forum
> Archives](http://forumsarchive.laravel.io/viewtopic.php?pid=11232#p11232)

> **note**

> When you specify your document root, MAMP will follow the symlink and
> substitute the actual build folder path. This means that when you
> rebuild your project locally, you will need to repoint the docroot to
> the symlink again so it will refresh the build path.


