# Frequently Asked Questions (FAQ)

## What is the difference between a Platform, a Project and an Environment?

Platform or Platform.sh is the infrastructure which is running all your projects.

A project is the site that you're working on. Each project can contain multiple applications and be deployed in their own environments.

An environment is a standalone copy of your site, complete with code, data, and running services. The master branch is the production environment, while any other branch can be setup as an otherwise identical testing environment.

## How can I cancel my subscription?

If you want to delete your project and cancel your subscription, simply go to your user profile and click on "Edit plan" on the project you want to delete. Then you can click on the link: "delete your Platform.sh plan".

This will delete your project and stop invoicing for this project. If you have multiple projects, your subscription will continue until you don't have any projects left.

## Do you support MySQL?

[Platform.sh](https://platform.sh) uses MariaDB to manage and store your databases. It's a fork of MySQL which is more stable and has more interesting features.

## Does branching an environment duplicate services?

Yes! Branching an environment creates an exact copy (snapshot) of the parent environment, containing the files, the database, the services...

## Do you have a local writable file-system?

Yes! Unlike other PaaS providers Platform.sh supports non-ephemeral storage. When you configure your application you can tell us what directories you want to be read/write (these are called mounts). These will be mounted on a distributed file system (which is transparent for you). When you back-up your environment they will be backed up as well. When you create a new staging environment... these will be cloned with the rest of your data.

## What happens if I push a local branch to my project?

If you push a local branch that you created with Git, you create what we call an `inactive environment`, ie. an environment that is not deployed.

This means there won't be any services attached to this branch.

You are able to convert an `inactive environment` into an `active environment` and vice versa back from the environment configuration page or using the CLI.

## How does Master  (the live site) scale?

Master gets all the resources that are divided into each service (PHP 40%, MySQL 30%, Redis 10%, Solr 20%…). Each Development environment gets the Development plan resources.

## Can I run Python 3 in the build hook of a non-Python application?

Yes. The version of Python 3 [distributed with the most recent release of Debian](https://wiki.debian.org/Python#Supported_Python_Versions) is available in the build hook of non-Python applications. However, packages cannot be installed directly in the distribution's `site-packages` folder, so using Python 3 will require creating a virtual environment for package installation.

At the top level of your application (where `.platform.app.yaml` is located), create a file called `python3.sh`, and paste in the following contents:

```shell
#!/bin/dash

# Create a virtual environment for running Python 3 and installing packages
python3 -m venv py3-venv --system-site-packages --without-pip

# Source the activation file to activate the virtual environment
. py3-venv/bin/activate

# Install pip using the standard pip bootstrapping script
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py

# (Optionally) Install dependencies using pip3 and a requirements.txt file
# pip3 install -r requirements.txt

# Or install dependencies with pip3 directly
# pip3 install pyyaml
```

To create and access the virtual environment, source the file in your build hook:

```yaml
hooks:
    build: |
      set -e

      # Source the python3.sh venv creation script
      . ./python3.sh

      # Now you can install dependencies with pip3. For example:
      pip3 install requests

      # And run Python 3 using the activated virtual environment
      python3 --version
```

> **Caution**
> This method of running Python 3 in non-Python applications should only be used *[in an application's build hook](/configuration/app/build.md#build)* when Python 3 is necessary to build or configure your application (e.g. pre-compiling static files). If you need a full Python application to run alongside another type of application (PHP, Node.js, etc.), you should deploy it as part of a [multi-application project](/configuration/app/multi-app.md).

## What exactly am I sshing into?

You're logged in to the PHP service. It's a read-only file system.

## Can I edit a quick fix on a Platform environment without triggering a rebuild?

No ! Since the PHP service you access via SSH is a read-only file system, you'll have to push your fix to be able to test it.

## What do I see when I push code?

We try to make the log as self-explanatory as possible, so you should see the Git output and also output from the drush make...

You can also find it back by clicking on the status of the activity in the `Platform UI`.

## What Linux distribution is Platform.sh using?

Platform.sh is built on Debian.

## If I choose the Development plan, can I use that plan for production?

The Development plan provides all the tools to build your website. You can create as many development profiles as you wish for yourself and for your team.

Once your project is built and ready for production, you can choose another plan to go live. These plans are listed on the [pricing page](https://platform.sh/pricing/).

## Can I please use tabs in my YAML files?

No.

## I am getting weird errors when I push (something with paramiko..)

Please validate the syntax of your YAML file. Don't use tabs. And if all fails, contact support.

## Which geographic zones does Platform.sh cover?

Platform leverages the powerful AWS Infrastructure.  We can deploy your site in a [datacenter](https://aws.amazon.com/about-aws/globalinfrastructure/regional-product-services/) that is very close to your target audience.

## Why did you choose the .sh extension for your domain?

'sh' is the short version of shell.

According to Wikipedia™, in computing, a [shell](http://en.wikipedia.org/wiki/Shell_(computing)) is a user interface for access to an operating system's services. Generally, operating system shells use either a [command-line interface ](http://en.wikipedia.org/wiki/Command-line_interface) (CLI) or [graphical user interface](http://en.wikipedia.org/wiki/Graphical_user_interface) (GUI).  This is exactly what Platform.sh is about: Giving developers tools to build, test, deploy, and run great websites!

".sh" is also the TLD for Saint Helena that looks like a lovely island, and whose motto is: "Loyal and Unshakeable" which we also strive to be.


## IDE Specific Tips

MAMP pro:

In order for MAMP to work well with the symlinks created by the [Platform.sh CLI](https://github.com/platformsh/platformsh-cli), add the following to the section under Hosts \> Advanced called “Customized virtual host general settings.” For more details visit [MAMP Pro documentation page](http://documentation.mamp.info/en/documentation/mamp/).

```bash
<Directory>
        Options FollowSymLinks
        AllowOverride All
</Directory>
```

> [Laravel Forum Archives](http://forumsarchive.laravel.io/viewtopic.php?pid=11232#p11232)

> **note**

> When you specify your document root, MAMP will follow the symlink and substitute the actual build folder path. This means that when you rebuild your project locally, you will need to repoint the docroot to the symlink again so it will refresh the build path.

## Do you support two-factor authentication?

Yes we do, and it is easy to enable.  To do so please go to your **Account Settings** on our [Account site](https://accounts.platform.sh/). Then click on the left tab called **Security** which will propose you to enable **TFA Application**.
