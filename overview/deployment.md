# Deployment process

## What happens when you deploy an application?

Deploying an app means simply pushing the source code to your Git server
hosted on Platform.sh. 

The Git server is part of your projects cluster so it is totally isolated from
other clients.

The Git server that runs on Platform.sh is at the same time "just a
normal Git repository" and a very smart piece of software. When you have
pushed to it, it will parse the configuration files you committed to your 
repository so it knows what it needs to deploy (more on that later).

If you are pushing directly to the Platform.sh git you will see in your terminal
what is happening in real-time. The same information is going to get streamed
in real-time to the Web Interface.

If you are using the Bitbucket or Github integration you will not see the log
of the operations in the git session (because you are talking to their git 
server) but you can follow on whats happening in their interface, our in Platform.sh's Web Interface.

The only modification you need to do to your application is to tell it
to load its configuration from the environment (and we supply [all the
examples you need](https://github.com/platformsh/platformsh-examples)) instead
of hardcoded values.

There are a couple of "dot files" in YAML format you  put at the root
of your application that will describe its dependencies. You can say for
example "my app needs mysql as a database", or "my app needs this or
that other php extension", or you can say "my front web app depends on
these three API apps". 

If for example in order to build your app you need a specific NodeJS, Python or 
Ruby library (for example Less or Jekyll) you simply specify those in the YAML
file. There are many other aspects of the application you can control through 
this simple declarative style. You don't write scripts, you just tell 
Platform.sh what you need.

## Platform.sh is build oriented

This very smart Git server on the other side is going to operate in five
steps.

### Configuration validation

First the Git server is going to inspect what you have sent it and see
that it understands what it is supposed to do. If for example you have a
syntax error in a configuration file, it will simply refuse the push.

The same goes for code where Platform.sh can detect a critical vulnerability. 
Platform.sh will refuse the push. This is a good thing; Because it means you 
can't break your production system that easily. Once the Git server has
validated the configuration and sees it can satisfy the requirements, it
will build the cluster.

The Git server is smart. It can diff not only the code but also the
infrastructure; Say you had a single MySQL database in your cluster. And
now you want two of those, or maybe add a PostrgreSQL and an Elastic Search
instance. It will understand what it needs to do in the next phase to
make sure the topology of your cluster is modified to your new needs.

### Build Phase

We already said the Git server was smart... and it is a Git server. So it
will only build stuff that has changed. This is one of the things that
make Platform.sh so fast in deployment. Using Linux Containers,
Platform.sh will now, in parallel, build each server that had something
that changed. If for example you pushed a Drupal Drush Makefile, or a
PHP composer.json file, it will know it needs to go search for the
dependencies, and shuffle things around to create the correct directory
structure. If in your .platform.app.yaml file you also specified a
"build hook", you can now run whatever scripts you wish.

It is important to note that at this point the cluster has not been
created yet. So you should not try to connect to a database or imagine
anything was daemonized; This is just a build phase.

But also know that once the application has been built it is going to be
mounted on a read-only file system (you will be able to configure specific
mount points that are going to be read/write). 

This means you can not "ftp" to the server and add modules. So, if you are
used to be working like this, this is going to change some of your habits.

You will soon understand how powerful this is. It makes your deployments
consistent. And it means you can always redeploy safely. Hacking production
directly is simply not a good idea.

### Prepare slug

The result of the build phase will be a file system, of which we now
create an archive. We put this in permanent storage. So the next time
you push code, if a service did not change.. well we can just use this one;

It also means that if you want to revert a deploy, it is basically
instantaneous. Deterministic deployments are repeatable and reversible,
after all.

### Deploy slugs and cluster

Now Platform.sh provisions of all the elements it needs to run your
application cluster: your application(s) and all the backend services you
need. It will mount each service in its own container, mount their Read/Write storage (that is hosted on a highly available distributed storage grid), and
configure the network so they can see each other (and only each other!).

Here you need to remember that the main file system is read-only. This
is what guarantees the fact that we can do deterministic deployments.

It will also mount all of the read/write directories you specified.

Again unlike other PaaS systems, Platform.sh gives you persistent,
normal, storage, it just needs to know which directories contain stuff
that is mutable.

### Deploy hooks

A last step allows you to run a post-deploy script (you can use this for
example to run an anonymization script for deployment on development
environments, clear caches, ping external CI tools, etc.) When this
script runs you already have access to a fully running application.

### Configure routing
While the deployment is running we freeze the incoming traffic at the entry-point
so no transactions are going to be lost.

If everything went fine, we are now ready to configure routing, so your
web traffic will arrive at your newly created cluster. If something
failed, well then nothing would have happened; the "old cluster" is
still there, so from your users' perspective, nothing changed. Neither
failed nor successful deployments result in application downtime.
Because we also route SSH you can also simply SSH to your cluster where
you have the same permissions to execute commands as the web server.
