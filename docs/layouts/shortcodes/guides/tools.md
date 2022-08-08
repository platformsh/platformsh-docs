Next, you need a couple tools to interact with your project, one of which you likely already have.

* [Git](https://git-scm.com/downloads).
  Git is the primary tool you use to manage everything your app needs to run.
  Every commit pushed results in a new deployment, and all of your configuration is driven almost entirely by a small number of YAML files in your Git repository (which we will get to in the steps below).
  Your infrastructure, described in these files, becomes part of your application itself - completely transparent and version-controlled.

* The [Platform.sh CLI](/administration/cli/_index.md).
  This lets you interact with your project from the command line.
  You can also use your browser, but the CLI is the tool you use the most in this guide.
