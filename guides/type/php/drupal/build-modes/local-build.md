#Build your project locally

After you have cloned your project locally with `platform get`, the Platform.sh CLI will build the project. It produces a local representation of what the remote Platform.sh environment would build, and saves it in the `./builds` directory of your local project.

You can run `platform build` at any time to run the process again.

```bash
~/htdocs/my-project $ platform build
Building application (runtime type: php)
  Beginning to build ~/htdocs/my-project/repository/project.make.
  drupal-7.34 downloaded.
  drupal patched with install-redirect-on-empty-database-728702-36.patch.
  Generated PATCHES.txt file for drupal
  platform-7.x-1.3 downloaded.
Symlinking files from the 'shared' directory to sites/default

Build complete
Web root: ~/htdocs/my-project/_www
```
