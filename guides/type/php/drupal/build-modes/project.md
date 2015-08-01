# Drush Make build mode

This is the preferred for of deployment with Platform.sh, there are many benefits from
using it, not the least being that it allows you to get automatic security updates applied.

The Drush Make build mode looks for a `project.make` file which will get
executed during the build process.

The default `project.make` file for a Drupal 7 installation looks like
this:

```bash
    api = 2
    core = 7.x
    
    ; Drupal core.
    projects[drupal][type] = core
    projects[drupal][version] = 7.38
    projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"
    
    ; Platform indicator module.
    projects[platform][version] = 1.3
    projects[platform][subdir] = contrib
```
