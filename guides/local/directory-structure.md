#Local directory structure
Now you can see the local directory structure that the Platform CLI
provides for your local development:

```bash
$ ls -1
builds     # Contains all builds of your projects
repository # Checkout of the Git repository
shared     # Your files directory, and your local settings file file
www        # A symlink that always references the latest build.
           # This should be the document root for your local web server
```

The `builds` directory contains every build of your project. This is
relevant when you use a Make files to assist in your site building.

The `repository` directory is your local checkout of the Platform.sh Git
repository. This is where you edit code and issue normal Git commands,
like `git pull`, `git add`, `git commit`, and `git push`.

The `shared` directory is where you would put configuration files for your
local environment. But more on these concepts later.

The `www` symlink is created by the `platform build` command and will
always reference the latest build in the builds directory. The `www`
directory should become your DOCROOT for local development.
