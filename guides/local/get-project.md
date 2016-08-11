# Use the Platform.sh CLI to obtain and build your project’s repository
Convientiently on the Web Interface we give you the command you can copy and
paste into your terminal.

So lets `cd` to wherever you put your sites (for example ~/htdocs or ~/Sites).

![Platform Web Ui Platform Cli Get](/images/platform-web-ui-platform-cli-get.png)

And paste the command to our terminal:
```
$ platform get vmwklzcpbi6zq a-drupal-site-for-the-masses --environment master
Created project directory: a-drupal-site-for-the-masses
  Cloning into 'a-drupal-site-for-the-masses/repository'...
The project A Drupal Site for the Masses was successfully downloaded to: a-drupal-site-for-the-masses
Building application php using the toolstack php:drupal
  Beginning to build                                                   [ok]
  /var/htdocs/platform-projects/a-drupal-site-for-the-masses/repository/project.make.
  drupal-7.38 downloaded.                                              [ok]
  drupal patched with                                                  [ok]
  install-redirect-on-empty-database-728702-36.patch.
  Generated PATCHES.txt file for drupal                                [ok]
  platform-7.x-1.3 downloaded.                                         [ok]
Saving build archive...
Creating file: /var/htdocs/platform-projects/a-drupal-site-for-the-masses/shared/settings.local.php
Edit this file to add your database credentials and other Drupal configuration.
Creating directory: /var/htdocs/platform-projects/a-drupal-site-for-the-masses/shared/files
This is where Drupal can store public files.
Symlinking files from the 'shared' directory to sites/default
Build complete for application php
```

The Platform CLI downloaded your project and built it. If now we cd to the
directory, in our case `cd a-drupal-site-for-the-masses`, we will see three
directories.
