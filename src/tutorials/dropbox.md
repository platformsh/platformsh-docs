# Setting up the Dropbox daemon

Dropbox has a Linux version that can be installed into your Platform.sh application with a bit of intermediate [build hook](/configuration/app-containers.html#hooks) hacking.

This is a hack, and in no shape way or form do we condone its use. To transfer files to your instance you should `scp` or the very usef CLI command `platform mount:upload`. That is robust.

That said, if you insist, here is how you would go about this.

## Installing the daemon

Add this to your build and deploy hooks:

```yaml
hooks:
  build: |
    # add these two lines
    wget -nv "https://www.dropbox.com/download?plat=lnx.x86_64" -O archive.tar
    tar xzvf archive.tar && rm archive.tar
    # add this to the deploy hook so we are sure the meta-data directory exists.
  deploy: mkdir -p dropbox-dir/.dropbox
```

The build hook runs when your application's codebase is being assembled for deployment, so the filesystem is still writable.  This means that the above command will create a `~/.dropbox-dist` directory in the home directory of your application, aka "the application root".  

## Creating the necessary writable directories

You'll need to a writable/mounted directory for Dropbox to write files in. Here we name it `dropbox-dir` it will contain two directories `Dropbox` where you will find the files that are synchronized and a metadata directory  `.dropbox`.  This is typically modestly sized, on the order of less than 100MB.  

Because Dropbox files are mirrored to your writable disk mount, your application container's disk size needs to be large enough to accommodate all of your Dropbox files as well as any user-uploaded files and your own code. You should also include sufficient extra space to allow for growth over time.

```yaml
disk: 2048
mounts:
    'dropbox-dir':
        source: local
        source_path: 'dropbox-dir'
```

## First run

Make sure you published this initial work to your environment by running `git push`.  `ssh` into your application's container, either by grabbing the URL from the "access site" link in your project's admin UI or by running `platform ssh` if you've installed the [Platform CLI](/gettingstarted/cli.md) (recommended).

You should see a `~/.dropbox-dist` directory as a result of your build hook.  Run this - `HOME=/app/dropbox-dir ~/.dropbox-dist/dropboxd` and you'll be presented with some text in `stdout` that asks you to visit a tokenized Dropbox URL that will authenticate your new Dropbox client against your account and store the results in the `~/.dropbox` directory. Visit the URL in a browser and login to your Dropbox account.

After authenticating, you'll notice that the client just hangs there because by default it runs in the foreground.  Press control-c to kill the process. 

Now, execute, still in your SSH session `echo $PLATFORM_APP_COMMAND`. This will give you the default start command used in your application. Take note of this. It should be something like `/usr/sbin/php-fpm7.2-zts` for PHP 7.2 for example.

## Deploying the final solution

Return to you editor and open `.platform.app.yaml` again. Add the startup command to `web.commands.start`, modified to run in the background. After you edit your `web` section it should look like this -

```yaml
web:
  commands:
    start: |
      HOME=/app/dropbox-dir nohup ~/.dropbox-dist/dropboxd >/dev/null 2>&1 &
      /usr/sbin/php-fpm7.2-zts
  locations:
    # rest of config...
```
The first command will run the Dropbox daemon in the background, the second will run the PHP process in the foreground (you must never ever run a command in `start` in the background or it will enter an infinite loop). 

> **notice** You should notice we add `HOME=/app/dropbox-dir` before running the Dropbox daemon. This is because by default Dropbox wants to use `~/.dropbox` for its meta-data directory and mounts in Platform.sh may not be hidden.

Commit this to your project and push it to Platform.sh.  This will download a fresh copy of the Dropbox daemon and run the startup command every time you deploy from now on.

## Caveat

The configuration that was stored in the `.dropbox` directory will be available in any child environments that are created out of whichever one you set all this up in.  They can also be sync'd to any child environments you've already created and will function as intended.  

> **Note: The Dropbox directory will be automatically synced between your various environments, ie what you upload to dev will also appear in Master and vice versa.  This counter to how mounted directories typically work, where each environment is totally isolated from the others.**

If you're doing this in a child branch (anything other than `master`), you'll likely need to comment out the `web.commands.start` portion and run `~/.dropbox-dist/dropboxd` from inside the parent container to login to Dropbox there after you've merged the child branch.  Then you can uncomment the `web.commands.start` portion and everything should work as intended.

Also, this is intended to show creative use of build hooks, and not as an endorsement of whether or not it is a good idea to mount your Dropbox into your application. ** It is not. **  It is neither a better nor worse idea than any other Linux setup.  As with much of application development, you swim at your own risk.
