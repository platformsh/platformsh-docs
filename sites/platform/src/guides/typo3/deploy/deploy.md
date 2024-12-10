---
title: "Deploy TYPO3"
sidebarTitle: "Deploy"
weight: -80
description: |
    Now that your site is ready, push it to {{% vendor/name %}} and import your data.
---

{{% guides/deployment %}}

## Post-install (new site)

The following section is only relevant when deploying the TYPO3 template
or creating a new site from scratch locally using Composer.
If you're migrating an existing site, you can move on to the next step.

```yaml {configFile="app"}
hooks:
  # The deploy hook runs after your application has been deployed and started.
  # Code can't be modified at this point but the database is available.
  # The site isn't accepting requests while this script runs so keep it
  # fast.
  deploy: |
    # Exit hook immediately if a command exits with a non-zero status.
    set -e

    # Set TYPO3 site defaults on first deploy.
    if [ ! -f var/platformsh.installed ]; then
      # Copy the created LocalConfiguration into the writable location.
      cp public/typo3conf/LocalConfiguration.FromSource.php var/LocalConfiguration.php

      # On first install, create an inital admin user with a default password.
      # *CHANGE THIS VALUE IMMEDIATELY AFTER INSTALLATION*
      php vendor/bin/typo3cms install:setup \
        --install-steps-config=src/SetupDatabase.yaml \
        --site-setup-type=no \
        --site-name="TYPO3 on {{% vendor/name %}}" \
        --admin-user-name=admin \
        --admin-password=password \
        --skip-extension-setup \
        --no-interaction

      # Sets up all extensions that are marked as active in the system.
      php vendor/bin/typo3cms extension:setupactive || true

      # Create file that indicates first deploy and installation has been completed.
      touch var/platformsh.installed
    fi;
```

The template is designed to run the TYPO3 installer only on the first deploy
by creating a placeholder `platformsh.installed` on the `var` mount.
You should not remove this file unless you want the next deployment to run through the installer again.

Next, when the deploy hook ran through the installer, it set an initial username and password for the TYPO3 site,
which you should update immediately.
Visit `/typo3` on the generated URL for the environment and login with those temporary `admin` credentials.
Then click on the user icon in the top right of the page and go to User Settings > Password to update.

{{% guides/data-migration /%}}

Go forth and Deploy (even on Friday)!

{{< guide-buttons previous="Back" next="More resources" >}}
