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

## 1. Install the CLI

{{% cli-installation %}}

## 2. Test the CLI

To interact with your projects you need to be logged in.
To open the authentication page and get a list of your Platform.sh projects, run:

```bash
platform
```

## 3. Clone your project locally

To clone your project locally:

1. Get a list of your Platform.sh projects with: `platform project:list`.
2. Copy the ID of your project from the project list.
3. Download a local copy of the project's code repository with:

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
