# Setting up the Dropbox daemon

- Time needed: ~10 minutes

Dropbox has a very useful [Linux version](https://www.dropbox.com/install-linux) that can be installed into your Platform.sh application with a bit of intermediate [build hook](/configuration/app-containers.html#hooks) hacking.

## Install the daemon

Per the instructions on [installing the Linux client](https://www.dropbox.com/install-linux), you can install the client via a simple one-liner shell command, but I needed to modify it slightly so modify your build hook to add this to it -

```yaml
hooks:
  build: |
    wget "https://www.dropbox.com/download?plat=lnx.x86_64" -O archive.tar
    tar xzvf archive.tar && rm archive.tar
```



The build hook runs when your application's codebase is being assembled for deployment, so the filesystem is still writable.  This means that the above command will create a `~/.dropbox-dist` directory in the home directory of your application, aka "the application root".  Starting the daemon is _almost_ as simple as running `~/.dropbox-dist/dropboxd` when you `ssh` into your application's container.

## Creating the necessary writable directories

Before we can start the daemon, we'll need to add a couple directories that Dropbox expects to be there and to be writable.  The main one is `~/Dropbox`, which contains **your entire Dropbox**.  (There may be a way to only mount part of it, and please do open a Merge Request to these docs if you figure it out).  For obvious reasons, this directory needs to be at least as large as all the contents of your Dropbox or you're going to have a Bad Time.

The other is a metadata/etc directory at `~/.dropbox`.  This author's `.dropbox` directory is 43M, so it doesn't appear to take up too much room.  

The combined total of these two directories needs to be smaller than whatever you've specified in the [`disk` parameter](/configuration/app-containers.html#disk) in your `.platform.app.yaml`, or put another way - the `disk` parameter needs to be larger than your total Dropbox usage.  (Don't forget to add a nice buffer on top of that too, because if your writable disk space fills up completely then Bad Things can happen).

```yaml
# for a 1G total Dropbox size, 
# leaving another 1G for the application
disk: 2048
# the needed mounts for the Dropbox daemon
mounts:
  "Dropbox": "shared:files/dropbox"
  ".dropbox": "shared:files/dropbox-meta"
```

**Make sure you've `git push`ed these configuration changes to us if you haven't already.**

## Starting the daemon

You'll eventually be building this step in to your [deploy hook](/configuration/app-containers.html#hooks), but first we need to start it manually so that you can perform the Dropbox login ceremony from your application's container.  Login to your application's container via `ssh`, either by grabbing the URL from the "access site" link in your project's admin UI, or by running `platform ssh` if you've installed the [Platform CLI](https://docs.platform.sh/overview/cli.html) (recommended).

You should see a `~/.dropbox-dist` directory as a result of your build hook.  Run this - `~/.dropbox-dist/dropboxd` and you'll be presented with some text in `stdout` that asks you to visit a tokenized Dropbox URL that will authenticate your new Dropbox client against your account and store the results in the `~/.dropbox` directory.

After authenticating, you'll notice that the client just hangs there because by default it runs in the foreground.  Press control-c to kill the process.  Let's add this to our deploy hook, and set it to run in the background as well.

Edit your `hooks` section to look like this -

```yaml
hooks:
  build: |
    wget "https://www.dropbox.com/download?plat=lnx.x86_64" -O archive.tar
    tar xzvf archive.tar && rm archive.tar
  deploy: |
    # starts the process as a daemon and sends all
    # output to /dev/null.  Obviously, feel free to
    # direct this output to a logfile(s) if you wish.
    nohup ~/.dropbox-dist/dropboxd >/dev/null 2>&1 &
```

Commit this to your project and push it to your Platform.sh project.

## Caveat

Once you get this all running, the configuration that was stored in the `~/.dropbox` directory will be available in any child environments that are created out of whichever one you set all this up in.  They can also be sync'd to any child environments you've already created and will function as intended.

If you're doing this in a child branch (anything other than `master`), you'll likely need to comment out the deploy portion (`nohup ...`) and run `~/.dropbox-dist/dropboxd` from inside the parent container to perform the Dropbox login ceremony there after you've merged the child branch.  Then you can uncomment the `nohup` line and everything should work as intended.

Also, this is intended to show creative use of the build and deploy hooks, and not as an endorsement of whether or not it is a good idea to mount your Dropbox into your application.  It is neither a better nor worse idea than any other Linux setup.  As with much of application development, you swim at your own risk.