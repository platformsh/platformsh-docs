Platform.sh documentation
=============================

Here is what you need to build the Platform.sh documentation locally.

Getting started
---------------------------

1. Clone the repository

  ```
  $ git clone git@github.com:platformsh/platformsh-docs.git
  $ cd platformsh-docs
  ```

2. Install Sphinx and dependencies

  ```
  $ sudo pip install sphinx
  ```

  (on Mac OS X you might need to do ``easy_install pip`` first)

3. Build the html

  ```
  $ make html
  ```

Once the build is finished, the HTML pages should be in `_build/html`.

Watch for changes
-----------------

Most of the times you want to keep the server up and recompile the HTML when any file changes.

For this:

1. Install Sphinx-Autobuild

```
$ sudo pip install sphinx-autobuild
```

2. Run the watcher

```
$ make livehtml
```

And change your files.

![http://creativecommons.org/licenses/by-sa/4.0/](images/CC-BY-SA.png)
