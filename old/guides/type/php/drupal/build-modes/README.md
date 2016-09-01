#Understand Build Modes

Platform.sh offers three build modes for Drupal projects:

-   **Profile**: Platform.sh builds your project like Drupal.org does
    for distributions.
-   **Project**: Platform.sh builds your make file using *drush make*.
    You don't need any Drupal core files nor any contributed modules,
    themes or libraries within your Git repository.
-   **Vanilla**: Platform.sh builds your project as it is in your Git
    repository. You can push all Drupal files and contributed modules,
    themes or libraries.

> **note**

> You can change build modes by changing the files in your repository.
> Platform.sh recognizes each mode based on the presence or absence of
> `project.make` or `*.profile` files.
