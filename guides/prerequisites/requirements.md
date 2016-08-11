# Installing requirements

[Platform.sh](https://platform.sh) requires git and ssh to be installed. You will also need to have
an SSH key generated. Here are a couple of external resources that will help you do this:

* [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [ Getting Started with SSH](https://ekkescorner.wordpress.com/blog-series/git-mercurial/step-by-step-ssh-on-osx-ubuntu-and-windows/) and [Generating SSH keys](https://help.github.com/articles/generating-ssh-keys/)

You could use Platform with nothing else by just pushing and pulling to  the Platform.sh git repo or
 connecting directly to a project environement through ssh to inspect logs, or run commands.

But [Platform.sh](https://platform.sh) also comes with a great tool called the Platform CLI.
It not only allows you to manage the local copy of your project but also to do any action
that is possible through the UI. You can use it to map domain names to a project. To launch
a backup or to manage users.

The [CLI is an open-source project hosted on GitHub](https://github.com/platformsh/platformsh-cli). You can find help or raise issues for the CLI in the [GitHub issue queue](https://github.com/platformsh/platformsh-cli/issues).
