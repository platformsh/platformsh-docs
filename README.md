Platform.sh documentation
=============================

Contribute
----------

The documentation is hosted on [Platform.sh](https://platform.sh) and uses the [GitHub webhook](https://docs.platform.sh/integration/webhooks/#github) to automatically deploy your pull requests into an isolated environment.

To contribute to the documentation, you can simply follow the ``Edit on GitHub`` link, and edit the page on GitHub. This will automatically create a pull request which gets automatically deployed by Platform.sh so that you can test your changes live following the URL that appears on the pull request feed.

Work locally
------------

If you want to build the documentation locally, here are the steps to follow.

1. Install Sphinx and dependencies

  ```shell
  sudo pip install sphinx
  ```
  
  (on Mac OS X you might need to do ``easy_install pip`` first)

2. Clone the repository

  ```shell
  git clone git@github.com:platformsh/platformsh-docs.git
  cd platformsh-docs
  ```

3. Build the html

  ```shell
  make html
  ```

Once the build is finished, the HTML pages should be in `_build/html`.

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

And start updating pages.

![http://creativecommons.org/licenses/by-sa/4.0/](images/CC-BY-SA.png)
