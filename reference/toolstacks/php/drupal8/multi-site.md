#Multiple Drupal  sites in a single Project

Platform.sh supports running [multiple applications in the same project](/user_guide/reference/platform-app-yaml-multi-app.html) 
and these can be two or more Drupal site. But, they would be separate Drupal 
instances , they will have their assets separate and live their lives apart and 
it would be much better for them not to share the same database (though they 
could).

# Drupal "Mutlisite" and Platform.sh

Platform.sh actively discourages running Drupal in "multisite" mode. Doing so
eliminates many of the advantages Platform.sh offers, such as isolation, safe
testing, and so forth.

Additionally, because of the dynamic nature of the domain names that are created for
the different environments the multisite configuration would likely be complex
and fragile.

We recommend running separate projects for separate Drupal sites, or using one of
the various "single instance" options available such as [Domain Access](https://www.drupal.org/project/domain),
[Organic Groups](https://www.drupal.org/project/og), or [Workbench Access](https://www.drupal.org/project/workbench_access).
