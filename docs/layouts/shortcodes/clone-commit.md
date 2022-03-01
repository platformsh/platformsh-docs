## Clones and commits

You can clone your codebase by running `platform get <projectID>`
or in your project in the console by going to Code > Git and running the `git clone` command.

When you perform this action, you are actually cloning from your remote integrated repository,
so long as you have the [appropriate access to do so](/integrations/source/troubleshoot.html).

Your {{ .Get "name" }} repository is considered to be the source of truth for the project.
The project is only a mirror of that repository and all commits should be pushed only to {{ .Get "name" }}.
