# Import files

### With Drush

We use *drush alias* to import your existing local files.

```bash
$ drush rsync @platform.local:%files @platform.master:%files
You will destroy data from [PROJECT-ID]-master@ssh.[REGION].platform.sh:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
Do you really want to continue? (y/n): y
```

> **note**
> Drush will verify that you are copying and over-writing the proper files folders, so double-check that information before you type `y` to continue.

This step may take some time, but when the process completes, you can
visit the URL of your development environment and test that the files
have properly been imported.

### Without Drush

Go to your files folder on your local machine and synchronize them to
your remote Platform environment:

```bash
$ rsync -r files/. [PROJECT-ID]-master@ssh.[REGION].platform.sh:public/sites/default/files/
```