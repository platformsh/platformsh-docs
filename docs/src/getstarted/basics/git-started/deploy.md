---
title: "Your first deploy"
weight: 2
description: |
  Investigate commits, environment variables, builds and deploys.
---

## What happened

### The environment

Go to the management console.

On the project landing page, click **Main** under the **Environments** section to visit the environment you just pushed to.
This is the production environment for your project. 
It's here where you can add a domain, and build out your production site.

At the bottom of that section, you will see two events listed under **Recent** activities. 

![First push](/images/getstarted/first-push.png)

Those two events reflect what you've done so far - you've created a Platform.sh project, and pushed application and routes configuration to the production environment **Main**.
Expand the **push** event dropdown and **View the log** for that activity.

### Build

Now let's go through this log step-by-step to see how Platform.sh took the configuration you committed to build and deploy your repo.
Depending on the language you've chosen, the contents below will vary slightly, but in general the log will look like this:

```bash
Found X commits

Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 6fa1eef)
  Generating runtime configuration.
  
  Installing build dependencies...
    Installing LANGUAGE build dependencies: XXXXXXX

    ...

  Executing build hook...

    ...

  Executing pre-flight checks...

  Compressing application.
  Beaming package to its final destination.
```

The log above follows what you have committed in `.platform.app.yaml`:

- A certain number of commits are registered to create a new **build image**.
- A **build image** is created, using your configured language runtime (noted by a `LANGUAGE` and a `VERSION`).
- Build dependencies are installed.
- A build `hook` is run to install additional dependencies in your lock file.
- The build image is compressed.
- The build image is moved out of the build phase. 

These are the relevant steps to the **build phase** on Platform.sh, where a build image was created based on your commits.
This build image leverages Git's concept of a _tree_, which associates a unique hash with the state of your repository at a point in time. 

In this case, the build image associated with tree `6fa1eef` (your hash may be different) contains `X` commits, one application container, one router container, the application code you cloned in the beginning of this guide, and the current state of its dependencies as defined in your lock file.

While it may not be evident here, this is the only stage of the build-deploy pipeline where there is write access (you are able to install dependencies, for example).
Once the build image is created, it is immutable, and cannot be modified. 
This is an important feature you will explore when you get to branching and merging environments.

### Deploy

The next half of the log shows the **deploy phase** of your push:

```bash
Provisioning certificates
  Validating 2 new domains
  Provisioned new certificate for 2 domains
  (Next refresh will be at 2022-06-20 11:42:41+00:00.)
  Certificates
  - certificate 58302c7: expiring on 2022-07-18 11:42:41+00:00, covering {,www}main-...platformsh.site


Creating environment main
  Starting environment
  Opening application app and its relationships
  Opening environment
  Environment configuration
    app (type: LANGUAGE:VERSION, size: S)

  Environment routes
    http://main-...platformsh.site/ redirects to https://main-...platformsh.site/
    http://www.main-...platformsh.site/ redirects to https://www.main-...platformsh.site/
    https://main-...platformsh.site/ is served by application `app`
    https://www.main-...platformsh.site/ redirects to https://main-...platformsh.site/
```

Here a few things happened:

- Certificates were provisioned for the environments. Platform.sh automatically provisions Let's Encrypt TLS certificates for every environment, which are also renewed automatically before they expire.
- An environment was created. In the previous step, the resulting **build image** was not actually associated with an environment on Platform.sh. It existed in an isolated place until this stage, where the build image was placed into the provisioning environment **Main**, decompressed, and transformed into the **file system** for that environment. As mentioned previously, this file system does not have write access, and is **read-only** at this point.
- The environment is started, and then opened up to the outside world (it begins accepting requests).

Platform.sh also generated a URL for the environment, which takes the place of the `{default}` placeholder that was included in `.platform/routes.yaml`. 
Until you add a custom domain, this will be the URL for your production site. 

## Inside a container

From your terminal, run the command `platform ssh`:

```bash
$ platform ssh

 ___ _      _    __                    _    
| _ \ |__ _| |_ / _|___ _ _ _ __    __| |_  
|  _/ / _` |  _|  _/ _ \ '_| '  \ _(_-< ' \ 
|_| |_\__,_|\__|_| \___/_| |_|_|_(_)__/_||_|
                                            

 Welcome to Platform.sh.

 This is environment main-bvxea6i
 of project PROJECT_ID.
```

With the above command, you have gained access to the running application container using SSH where you can see your pushed files (`ls -a`).

### Environment variables

Run the command `printenv` to view some of the environment variables available within the container.
You will notice that many of these variables contain the prefix `PLATFORM_`. 
These variables are provided by Platform.sh, which contain information about your configuration, as well as more information about the environment itself.
You can explore these values by running the commmands below.
Notice that some variables are base64-encoded JSON objects, and require a pipe to access values.

- `echo $PLATFORM_TREE_ID`: The full tree hash associated with the environment's currently deployed build image.
- `echo $PLATFORM_ENVIRONMENT_TYPE`: The value should be `production`. While environment's do not need to differ by default on Platform.sh, later on if you want to include business logic that executes deploy tasks differently on "development" or "staging" environments than "production", you are able to do so through this variable. 
- `echo $PLATFORM_ENVIRONMENT`: The name of the production environment. It will include the branch name (`main`) and a unique hash, which is also used to generate the environment's URL.
- `echo $PLATFORM_PROJECT`: The project's ID.
- `echo $PLATFORM_APPLICATION | base64 --decode | jq`: Your application configuration, in a base64-encoded JSON object. 
- `echo $PLATFORM_ROUTES | base64 --decode | jq`: Your routes configuration in a base64-encoded JSON object, which now includes the generated environment URLs.

### Variables and builds

You can add custom variables to both projects and environments. 
Depending on how you do so, you can influence the build image used on an environment. 
First, exit the current SSH session with `ctrl + d`.

Then run the command:

```bash
platform variable:create -l environment --name DEPLOY --value FRIDAY --prefix=env: -n
```

The above command adds an environment variable named `DEPLOY` to the current environment.
In the managment console, you will see a new activity appear for that change.
When the activity completes, you can SSH once again into the container (`platform ssh`) and see that the new variable is now accessible (`echo $DEPLOY`).

From the management console, notice the first few lines of the activity's log:

```bash
Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 6fa1eef)
  Reusing existing build for this tree ID
```

When you added the variable, you did not change any of the things important to the **build image**.
That is, you did not modify the infrastructure, application code, or dependencies. 
All you did was add a new variable that is accessible at runtime.
Because of this, the *exact same* build image created in the first push is reused (`Reusing existing build for this tree ID`), and it is not necessary to re-install dependencies or rebuild the application.

Let's modify the variable slightly. 
Run the following command:

```bash
platform variable:update env:DEPLOY --visible-build=true
```

This command updates the previous variable by making it accessible _during_ the build phase, where it was previously only available at runtime. 
If you inspect the new activity in the managment console, you will see that dependencies are re-installed and a new build image is created. 

This is perhaps the most important point to understand when working with Platform.sh. 
It's a platform that enables you to create isolated development environments - identical to production - and it does that by leveraging Git to reuse these unique build images.
A build image changes only when you do something to update the circumstances of this build phase - like a variable being accessible. 

This is not the only way to update the build and create a new build image.
Next, you'll see reusable builds during branching - the creation of new development environments. 
Then within those environments, you'll make other changes that will affect this process.

{{< guide-buttons next="Create an environment" >}}
