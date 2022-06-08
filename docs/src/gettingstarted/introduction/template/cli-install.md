---
title: "Install the CLI"
sidebarTitle: "Install the CLI"
actualTitleBreaksNavs: "Next Steps: Installing the Platform.sh CLI"
weight: 5
toc: false
aliases:
  - "/gettingstarted/template/cli-install.html"
---

With all of the requirements met, install the CLI to start developing with Platform.sh.

{{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}

1. **Install the CLI**

    Install the CLI using this command:

    ```bash
    curl -fsS https://platform.sh/cli/installer | php
    ```

    If you run into issues or want to install manually, see the [installation instructions on GitHub](https://github.com/platformsh/platformsh-cli#user-content-installation).

2. **Clone your project locally**

    Get a list of all available commands with:

    ```bash
    platform list
    ```

    You should now see a list of your Platform.sh projects, including the template you made in this guide.
    You can copy its *project ID* hash, and then download a local copy of the repository with this command:

    ```bash
    platform get <PROJECT_ID>
    ```

    With a local copy, you can create branches, commit to them, and push your changes to Platform.sh right away!

    ```bash
    git push platform main
    ```

That's it!
Now that you have the management console set up and the CLI installed on your computer,
you're well on your way to exploring all of the ways that Platform.sh can improve your development workflow.

{{< guide-buttons next="I've installed the CLI" >}}
