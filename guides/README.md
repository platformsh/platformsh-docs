#Platform.sh Getting Started

Platform.sh is a hosting and development tool for PHP applications. With Platform.sh the developer
develops his application, and we take care of the rest, automatically setting up web servers,
databases and caches, configuring them all to work together.

Our job is to make developers' lives easier, and to practically eliminate all sysadmin chores.

## Minimal Configuration
In order to use Platform.sh it is sufficient to have git and ssh configured. From there you can just push and pull
code and collaborate with others, everything you need will be there. And you can do everything else through the
web interface. But you'd probably want to install our CLI (command line tool) that will make this process even
 easier.

Though Platform.sh is a git server, you would often use another git hosting service such as Bitbucket, Github or
 an internal Gitlab, and we have great support for that too.

In order for the whole thing to work properly you **have** to configure your Platform.sh project. Configuring
Platform.sh is really simple: you create two or three small YAML files in which you describe your application, and slightly modify your application's configuration code so it can take its configuration dynamically from
Platform.sh. More on that later.

Every application will be a bit different, so we have created many examples you can follow and adapt
to your own situation.
