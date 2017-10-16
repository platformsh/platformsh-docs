# Setting up the Dropbox daemon

Dropbox has a very useful [Linux version](https://www.dropbox.com/install-linux) that can be installed into your Platform.sh application with a bit of intermediate [build hook](/configuration/app-containers.html#hooks) hacking.  This could be useful if you are building a small application and don't want to build file upload functionality into it.  It could also prove useful to an editorial team to use images from a shared Dropbox rather than each individual uploading their own images.  

## Install the daemon

Per the instructions on [installing the Linux client](https://www.dropbox.com/install-linux) you can install the client via a simple one-liner shell command, but you'll need to modify it slightly in order to make it work with our version of `tar`.

Add this to your build hook -

```yaml
hooks:
  build: |
    # add these two lines
    wget "https://www.dropbox.com/download?plat=lnx.x86_64" -O archive.tar
    tar xzvf archive.tar && rm archive.tar
```

The build hook runs when your application's codebase is being assembled for deployment, so the filesystem is still writable.  This means that the above command will create a `~/.dropbox-dist` directory in the home directory of your application, aka "the application root".  Starting the daemon is _almost_ as simple as running `~/.dropbox-dist/dropboxd` when you `ssh` into your application's container.

## Creating the necessary writable directories

You'll need to add two writable/mounted directories that Dropbox expects to be there and to be writable.  The main one is `~/Dropbox`, which contains **your entire Dropbox**.  The other is a metadata directory at `~/.dropbox`.  This is typically modestly sized, on the order of less than 100MB.  

Because Dropbox files are mirrored on your writable disk mount, your application container's disk size needs to be large enough to accommodate all of your Dropbox files as well as any user-uploaded files and your own code. You should also include sufficient extra space to allow for growth over time.

```yaml
disk: 2048
# the needed mounts for the Dropbox daemon
mounts:
  "/Dropbox": "shared:files/dropbox"
  "/.dropbox": "shared:files/dropbox-meta"
```

**Make sure you've `git push`ed these configuration changes to Platform.sh if you haven't already.**

## Starting the daemon

You'll eventually be building this step in to [`web.commands.start`](/configuration/app-containers.html#commands), but first you'll need to start it manually so that you can login to Dropbox from your application's container.  `ssh` into your application's container, either by grabbing the URL from the "access site" link in your project's admin UI or by running `platform ssh` if you've installed the [Platform CLI](/gettingstarted/cli.md) (recommended).

You should see a `~/.dropbox-dist` directory as a result of your build hook.  Run this - `~/.dropbox-dist/dropboxd` and you'll be presented with some text in `stdout` that asks you to visit a tokenized Dropbox URL that will authenticate your new Dropbox client against your account and store the results in the `~/.dropbox` directory.

After authenticating, you'll notice that the client just hangs there because by default it runs in the foreground.  Press control-c to kill the process.  Add this startup command to `web.commands.start`, modified to run in the background.

Edit your `web` section to look like this -

```yaml
web:
  commands:
    start: |
      ~/.dropbox-dist/dropboxd >/dev/null 2>&1 &
      /usr/sbin/php-fpm7.0 # we do this by default for PHP7,
      # but you're overwriting the default web.commands.start so
      # you'll need to add it in manually.  Adjust according to your 
      # language and version.
  locations:
    # rest of config...

hooks:
  build: |
    wget "https://www.dropbox.com/download?plat=lnx.x86_64" -O archive.tar
    tar xzvf archive.tar && rm archive.tar
```

Commit this to your project and push it to Platform.sh.  This will download a fresh copy of the Dropbox daemon and run the startup command every time you deploy from now on.

## Caveat

The configuration that was stored in the `~/.dropbox` directory will be available in any child environments that are created out of whichever one you set all this up in.  They can also be sync'd to any child environments you've already created and will function as intended.  **Note: The Dropbox directory will be automatically synced between your various environments, ie what you upload to dev will also appear in Master and vice versa.  This counter to how mounted directories typically work, where each environment is totally isolated from the others.**

If you're doing this in a child branch (anything other than `master`), you'll likely need to comment out the `web.commands.start` portion and run `~/.dropbox-dist/dropboxd` from inside the parent container to login to Dropbox there after you've merged the child branch.  Then you can uncomment the `web.commands.start` portion and everything should work as intended.

Also, this is intended to show creative use of build hooks, and not as an endorsement of whether or not it is a good idea to mount your Dropbox into your application.  It is neither a better nor worse idea than any other Linux setup.  As with much of application development, you swim at your own risk.
