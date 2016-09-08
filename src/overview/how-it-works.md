# How it works

Every time you push to a live branch or activate a cluster for a branch there are two main processes that happen: *Build* and *Deploy*.  The build process looks through the configuration files in your repository and assembles the necessary LXC containers.  The deploy process makes those containers live, replacing the previous versions, with virtually no interruption in service.

![The Build and Deploy pipeline](/images/build-pipeline.svg)

## Building the application

The first build step is to select the Platform.sh-provided container images for the container. That always includes the router (of which there’s only one), the appropriate application container (both language and version), and any services requested.  Then their configuration files are added, based on the values provided in the appropriate configuration file.  Finally, for the application container, your code is added.  Each `.platform.app.yaml` file and all of the files below it are added to the corresponding application container.

Application containers then have three extra steps.  

1. First, any dependencies specified in the `.platform.app.yaml` file are installed.  Those include tools like Sass, Gulp, Drupal Console, or many others that you may need.  

2. Second, depending on the “build flavor” specified in the configuration file we run a series of standard commands.  At the moment only the PHP containers have useful build flavors, and the most common simply runs `composer install` on your application.

3. Finally, we run the “build hook” from the configuration file.  The build hook is simply one or more shell commands that you write to finish creating your production code base.  That could be compiling Sass files, running a Gulp or Grunt script, rearranging files on disk, compiling an application in a compiled language, or whatever else you want.  Note that at this point all you have access to is the file system; there are no services or other databases available.

Once all of that is completed, we freeze the file system and produce a read-only container image.  That container is the final build artifact: A reliable, repeatable snapshot of your application, built the way you want, with the environment you want.

Because the container configuration is exclusively based on your configuration files, and your configuration files are managed through Git, we know that a given container has a 1:1 relationship with a Git commit.  That means builds are always repeatable.  It also means we can, if we detect that there are no changes that would affect a given container, simply skip the build step entirely and reuse the existing container image, saving a great deal of time.

In practice, the entire build process usually takes less than a minute.

## Deploying the application

Deploying the application also has several steps, although they’re much quicker.

First, we pause all incoming requests and hold them so that there’s no interruption of service.  Then we disconnect the current containers from their file system mounts, if any, and connect the file systems to the new containers instead.  If it’s a new branch and there is no existing file system, we clone it from the parent branch.

We then open networking connections between the various containers, but only those that were specified in the configuration files.  No configuration, no connection. That helps with security, as only those connections that are actually needed even exist.  The connection information for each service is available in an application as environment variables.

Now that we have working, running containers there are two more steps to run.  First, if there is a “start” command specified in your `.platform.app.yaml` file to start the application we run that.  (Most containers will have that, except for PHP.)

Then we run your deploy hook.  Just like the build hook, the deploy hook is any number of shell commands you need to prepare your application.  Usually this includes clearing caches, running database migrations, and so on.  You have complete access to all services here as your application is up and running, but the file system where your code lives will now be read-only.

Finally once the deploy hooks are done, we open the floodgates and let incoming requests through your newly deployed application.  You’re done!

In practice, the deploy process takes only a few seconds plus whatever time is required for your deploy hook, if any.
