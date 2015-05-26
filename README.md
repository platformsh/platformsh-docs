Platform.sh documentation
=============================

This documentation is based on [Sphinx](http://sphinx-doc.org/) and rendered online at [docs.platform.sh](https://docs.platform.sh).

Contribute
----------

It's very simple to contribute to the documentation since you don't need to install or set up anything in your local machine to test and review your changes.

Simply open a Pull Request on top of the Master branch

This will automatically trigger a new environment on [Platform.sh](https://platform.sh) where you can test your changes.

Watch for changes
-----------------

Most of the times you want to keep the server up and recompile the HTML when any file changes.

For this:

1. Install Sphinx-Autobuild

```shell
sudo pip install sphinx-autobuild
```

2. Run the watcher

```shell
make livehtml
```

And change your files.

![http://creativecommons.org/licenses/by-sa/4.0/](images/CC-BY-SA.png)
