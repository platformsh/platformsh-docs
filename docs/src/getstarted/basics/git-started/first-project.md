---
title: "Deploying your first application"
sidebarTitle: "Your first project"
weight: 1
description: |
  Create your first application.
---

## Create a project

Anytime you want to deploy something on Platform.sh, you will begin by creating a new project.
On Platform.sh, a project will be roughly equivalent to your repository.
That is, a Platform.sh project will act as a `remote` for your site's repository. 

You will use the same codebase and project throughout these guides, making modifications along the way. 
Select where you would like to start based on the programming language of your choice, and run the provided command to clone the repository you will work from.

{{< codetabs >}}
---
title=PHP
file=none
highlight=bash
markdownify=false
---
git clone https://github.com/platformsh-demos/php platformsh-project
<--->
---
title=Python
file=none
highlight=bash
markdownify=false
---
git clone https://github.com/platformsh-demos/python platformsh-project
{{< /codetabs >}}

Open your editor and take a moment to take a look at the code.
You will find a very simple "Hello world" application, that will include only a few files to start. 
You can run the application locally at `localhost:8000` by running the following commands:

{{< codetabs >}}
---
title=PHP
file=none
highlight=bash
markdownify=false
---
$ cd platformsh-project
$ composer install
$ php -d variables_order=EGPCS -S localhost:8000 -t web
<--->
---
title=Python
file=none
highlight=bash
markdownify=false
---
$ cd platformsh-project
$ pipenv --three install
$ export PORT=8888 && pipenv run python server.py
{{< /codetabs >}}

From the root of that project (`cd platformsh-project`) run the following command, and answer the provided prompts:

```bash
platform create
```

{{< asciinema src="videos/asciinema/getstarted/project-create.cast" >}}

<details>
<summary><strong>Note:</strong> <code>project create</code> options</summary><br/>

The CLI asks you to set up some initial project configurations:

* `Project title`: You need a unique name for each project, so title this one something memorable like `My First Project`.

* `Region`: In general, choose the region that's closest to where most of your site's traffic is coming from.
  Here, go ahead and begin typing `us-3.platform.sh` and the CLI auto-completes the rest for you.

* `Plan`: Select the development plan for your trial project.

* `Environments`: Your default branch becomes the live production environment for your application.
  Additionally, other branches may be activated as fully running environments for developing new features.
  More on that [later](/gettingstarted/developing/dev-environments/_index.md).
  This value selects the maximum number of development environments the project allows.
  You can change this value later at any time.

  For now, press Enter to select the default number of environments.

* `Storage`: You can modify the amount of storage your application can use from the CLI and from the management console
  as well as upgrade that storage later once your project starts growing.

  For now, press Enter to select the default amount of storage.

</details><br/>

When the CLI has finished creating a project, it outputs your *project ID*.
This is the primary identifier for making changes to your projects and you will need to use it to set Platform.sh as the remote for your repository in the next step.
The command will also provide you with a link to the Platform.sh user interface - the **Management console** - which will have a URL that begins with `console.platform.sh`.
Open this link in your browser, as it will be relevant throughout the next steps.

`platform create` may ask you whether you would like to automatically make the new project a remote.
If you did not select yes at that point, you can configure it now with the following command:

```bash
platform project:set-remote PROJECT_ID
```

You can also retrieve the *project ID* with the command `platform project:list`, which lists all of your projects and their IDs in a table.


## Configure an application

At this point you have created a Platform.sh project and configured it as a remote for your local repo.
Before you push, you need to add some files that tell Platform.sh what to do with the application. 

The first important file is `.platform.app.yaml`, which configures how this repository should be built and deployed. 

Create that file:

```bash
touch .platform.app.yaml
```

Then copy and paste the following into that file:

{{< codetabs >}}
---
title=PHP
file=none
highlight=yaml
markdownify=false
---
name: app

type: 'php:8.0'

build:
  flavor: none

dependencies:
    php: 
        composer/composer: '^2'

hooks:
    build: composer install

web:
    locations:
        "/":
            root: "web"
            passthru: "/index.php"
<--->
---
title=Python
file=none
highlight=yaml
markdownify=false
---
name: app

type: "python:3.8"

dependencies:
    python3:
       pipenv: "2018.10.13"

hooks:
    build: pipenv install --system --deploy

web:
    commands:
        start: python server.py
{{< /codetabs >}}

This file defines an **Application container**, and specifically configures a few important things:

1. It gives the application a `name`.
1. It specifies its runtime `type`, as well as the version of that runtime that should be used.
1. It defines its `build` and relevant additional `dependencies` needed to build the application. 
1. It contains a `web` block, which will either provide a `start` command or `locations` where traffic should be directed to when the server runs. 

You may have seen similar configuration with other tools, and all of them represent an implementation of the DevOps principle of **infrastructure-as-code**.
With **infrastructure-as-code**, services necessary for your application to run - like the version of a programming language and runtime environment - are committed alongside application code. 
From there they can be revised, and inherited by new branches.

The basic philosophy here is simple: just as your code depends on external code bases (dependencies), it also _depends_ on specific infrastructure. 
Infrastructure is a _dependency_ of your applications, so it should be committed.

## Handle requests

The second file you'll need is a `.platform/routes.yaml` file.
This file defines a separate **Router container**, and controls how requests are handled when they come to the site. 

Add that file:

```bash
mkdir .platform && touch .platform/routes.yaml
```

Copy and paste the following into that file:

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

This file has defined two things:

1. All traffic should be directed to an `upstream` application, in this case the same application defined in the previous step named `app`. 
1. Any requests made to the `www` subdomain should `redirect` to that same original domain. 

You may also notice a placeholder value, `{default}`.
This placeholder is special - it allows the same configuration defined above to work across development environments.
More on that later. 

## Deploy

With these two files added, you're now ready to deploy the application to Platform.sh.
Commit and push the changes

```bash
$ git add .
$ git commit -m "Add Platform.sh configuration."
$ git push platform main
```

You will see in your terminal your first glimpse at the Platform.sh build-and-deploy process.
In the rest of the guide, each step of this process, as well as how they work, will be covered in much more detail. 
You can also visit the management console you opened before, and view the running process on **Main** - your project's current production environment. 

When the process completes, you should see the same site you had run locally now running at a random generated URL on Platform.sh. 
You can find the link for this environment in the management console, or retrieve it by running the command `plaform url`.

{{< guide-buttons next="What just happened?" >}}
