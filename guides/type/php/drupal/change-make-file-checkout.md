# Checking out an environment
Running `platform checkout add-theme` will pull that branch from Platform.sh
and switch to it.

Now let's enter the "repository" directory inside your projects directory. This
is the one that is versioned by git.

```
$ ls -1a
.git
.platform
.platform.app.yaml
libraries
modules
project.make
themes
```

You will see there is not much in here. You can read later all about our
configuration files in the `.platform` directory and the  `.platform.app.yaml`
file... and on how Drush Make files work..
