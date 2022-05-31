Next, you need a couple tools to interact with your Platform.sh project, one of which you likely already have.

* [Git](https://git-scm.com/).
  Git is the primary tool you use to manage everything your app needs to run.
  Every commit pushed results in a new deployment, and all of your configuration is driven almost entirely by a small number of YAML files in your Git repository (which we will get to in the steps below).
  Your infrastructure, described in these files, becomes part of your application itself - completely transparent and version-controlled.
  If you do not already have Git on your computer, you should [install it now](https://docs.github.com/en/get-started/quickstart/set-up-git).

* The [Platform.sh CLI](/development/cli/_index.md).
  This lets you interact with your Platform.sh project from the command line.
  You can also use your browser, but the CLI is the tool you use the most in this guide.

  {{% cli-installation-requirements %}}

  Install it for your operating system:

  {{% cli-installation %}}

  Once the installation has completed:

  {{% cli-installation-check %}}
