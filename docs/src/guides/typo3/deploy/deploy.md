---
title: "Deploy TYPO3"
sidebarTitle: "Deploy"
weight: -80
toc: false
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

With all of your files in place, it's time to create a project on Platform.sh, connect it to your repository and deploy your TYPO3 site.

### Push your changes

### Create a new project

From your command line, use the Platform.sh CLI to create a new project.

```bash
$ platform create
```

{{< asciinema src="videos/asciinema/project-create.cast" >}}

You will be able to give the project a title and choose a region closest to the visitors of your site. You also have the option to select more resources for your project, although the `development` plan should be enough for you to get started.

When the setup has completed, your terminal will provide some information about the new project:

```bash
The project is now ready!
<PLATFORMSH_PROJECT_ID>

  Region: <REGION>.platform.sh
  Project ID: <PLATFORMSH_PROJECT_ID>
  Project title: <TITLE>
  URL: https://console.platform.sh/<USERNAME>/<PLATFORMSH_PROJECT_ID>
```

This let's you know that the empty Platform.sh project has been created, and is ready to have code pushed to it. You will do exactly that with your TYPO3 repository in the next step by setting up an integration.

### Integrate and deploy

It is possible to push your code  directly to Platform.sh at this point, and use the project as a remote repository all on its own. Since this guide assumes you are either considering Platform.sh or actively migrating, the step will continue to assume that you would like to connect a third party repository on GitHub, GitLab, or Bitbucket to your new project.

First off, push all of the commits you have made throughout this guide to that repository.

```bash
$ git push origin platformify
```

Actually setting up the integration will differ only slightly depending on whether your repository is on GitHub, GitLab, or BitBucket, and in general you will need to retrieve some identifiable accesss token from the service along with the repository and it's name space. Both of these pieces of information are placed into a Platform.sh CLI command to set up the integration between the repository and the project. For example, you can integrate your project on Platform.sh with a public repository on GitHub with the following:

```bash
$ platform integration:add --type=github --project=PLATFORMSH_PROJECT_ID --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY
```

Where `PLATFORMSH_PROJECT_ID` is the ID provided when you created the project, `USER` is your GitHub username, and `REPOSITORY` is the repository name (without the `.git` ending). The `GITHUB-USER-TOKEN` in this case is a Personal access token generated from  within your Developer Settings.

You can find the specific integration command for your third-party Git service from the links below:

- [GitHub](/integrations/source/github.md) (for GitHub Enterprise, also see the `--base-url` flag below)
- [GitLab](/integrations/source/gitlab.md) (for GitLab Enterprise, also see the `--base-url` flag below)
- [BitBucket Cloud](/integrations/source/bitbucket.md#bitbucket-cloud)
- [BitBucket Server instance](/integrations/source/bitbucket.md#bitbucket-server)
- [Private repositories](/development/private-repository.md)

When you run the above command, the CLI will present you with a few options to configure the integration. In most cases the default settings will be the best option

- `--fetch-branches` (`true`):
- `--prune-branches` (`true`):
- `--build-pull-requests` (`true`):
- `--build-draft-pull-requests` (`true`):
- `--build-pull-requests-post-merge` (`false`):
- `--pull-requests-clone-parent-data` (`true`):
- `--baseurl` (`empty`):

## Post-install

You probably noticed the following lines of code in your `.platform.app.yaml` file during the deploy hook:

```yaml
    # The deploy hook runs after your application has been deployed and started.
    # Code cannot be modified at this point but the database is available.
    # The site is not accepting requests while this script runs so keep it
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
                --site-name="TYPO3 on Platform.sh" \
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

The template is designed to run the TYPO3 installer only on the first deploy by creating a placeholder `platformsh.installed` on the `var` mount. You should not remove this file unless you want the next deployment to run through the installer again.

Next, when the deploy hook ran through the installer, it set an intial username and password for the TYPO3 site, which you will want to update immediately. Visit `/typo3` on the generated url for the environment and login with those temporary `admin` credentials. Then click on the user icon in the top right of the page and go to User Settings > Password to update.

Lastly you will need to enable the `pixelant/pxa-lpeh` extension you added with Composer. From the Backend, click on the Extensions icon in the sidebar. Search for the extension and then `Activate` it.

**Note:** I'm not sure that this is true anymore. Using Composer on P.sh looks more like
- the extension is already activated
- `typo3conf` not being writable makes it so you can't "Deactivate" the extension, so you wouldn't be able  to  activate it anyway.
- looks like it's just put it all through composer

{{< guide-buttons next="More resources" >}}
