# Import files

### With Drush

You can use [*Drush site aliases*](http://docs.drush.org/en/master/usage/#site-aliases) to import your existing local files.

```bash
$ drush rsync @platform._local:%files @platform.master:%files
You will destroy data from [PROJECT-ID]-master@ssh.[REGION].platform.sh:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
Do you really want to continue? (y/n): y
```

> **note**
> Drush will verify that you are copying and overwriting the proper "files" folders, so double-check that information before you type `y` to continue.

This step may take some time, but when the process completes, you can
visit the URL of your `master` environment and test that the files
have properly been imported.

### Without Drush

Go to your "files" folder on your local machine and synchronize them to
your remote Platform environment:

```bash
$ rsync -r files/. [PROJECT-ID]-master@ssh.[REGION].platform.sh:public/sites/default/files/
```

## Directly from server to platform.sh
If the files folder is too large to fit on your computer, you can transfer them directly from server to server. If you have a firewall between the origin server and platform.sh, you can use agent-forwarding to enable a direct connection: 
```bash
$ ssh -A -t [USER]@[ORIGIN-SERVER] ssh -A -t [PROJECT-ID]-master@ssh.[REGION].platform.sh
$ rsync -a --delete [USER]@[ORIGIN-SERVER]:/var/www/drupal/sites/default/files/ public/sites/default/files
```

> **note**
> If you are using a Mac OS computer, you might experience issues where files with non-ascii characters in them don't work after transfer because Mac OS X uses decomposed form (like "a + ¨ = ä", a form known as NFD), not the usual composed form ("ä", a form known as NFC used everywhere else). One workaround is to use the direct server-to-server transfer method mentioned above. 
