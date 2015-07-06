#Build your project locally

If you are using drush make mode after you ran :

```bash
platform get [PROJECT-ID]
```

Platform.sh will have built a local representation of what the build output in the `./builds` 
directory of your local project.

If you make local changes to your make file you can run `platform build` to run the processagain.

```bash
~/htdocs/my-project $ platform build
  Building application using the toolstack php:drupal
  Beginning to build ~/htdocs/my-project/repository/project.make.
  drupal-7.34 downloaded.
  drupal patched with install-redirect-on-empty-database-728702-36.patch.
  Generated PATCHES.txt file for drupal
  platform-7.x-1.3 downloaded.
  Build complete
```