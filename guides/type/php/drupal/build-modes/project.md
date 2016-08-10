# Project mode

This is the most popular mode for deploying Drupal on Platform.sh.

Platform.sh looks for a `project.make` file, and if found it will be built using Drush Make. Contributed projects are typically downloaded into `sites/all`, while nearly everything else in the repository will be moved to `sites/default`.

An example `project.make` file for a Drupal 7 installation looks like this:

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
