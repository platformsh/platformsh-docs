# Step by step walkthrough of `git push` output
To better grasp what happens during a Git push, we'll show you what the output
of the `git push` command might look like with Platform.sh.

Platform.sh is very versatile, and the output you see may be wildly different
depending on the build process defined in your .platform.app.yaml, so this is
just an example.

In this case we have a PHP project with a lot of data backends, it uses MySQL,
PostgreSQL, Redis, and ElasticSearch. It has its PHP dependencies in a
`composer.json` file and it uses the Ruby library "sass" to compile the SCSS
during its build process.

The developer wanted to work on a new feature, so they created a new environment by
running `platform environment:branch maximal`. The new branch is named "maximal".

After modifying some files and committing the changes, the developer pushed the commit using:

```
$ git push
```

This is what the output looks like:
```

Counting objects: 4, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 428 bytes | 0 bytes/s, done.
Total 4 (delta 3), reused 0 (delta 0)
```

This was the normal output you would expect from a git server. If there were a
conflict it would have returned an error and asked you to resolve it.

```
Validating submodules.
```
Platform.sh supports git submodules and supports multiple applications, so you
can have multiple applications, each in its own git repository, but have a
single production environment for all of them. In this case we only have a
single application and no git submodules.

The output for each deployed application would have been similar to what you see
 below for a single application.

```
Validating configuration files.
```
Platform.sh now checks that your configuration files make sense. It will yell at
you impolitely if you used tabs instead of spaces in your yaml files. It
does many other validations, and tries to provide you with useful error
messages.

```
Processing activity: **Shelly** pushed to **maximal**
    Found 1 new commit.
```

Happy with what it got, it is going to start building your application(s).

```
    Building application 'myapp' (runtime type: php, tree: 551ee89)
      Generating runtime configuration.
```

Based on what you put in your `.platform.app.yaml`, it is going to build a
container for each application with the correct configuration.

```
      Installing build dependencies...
        Installing ruby build dependencies: sass
```
In this case, the `.platform.app.yaml` has defined a dependency on the Ruby sass
library, so that has been installed.

```
      Found a `composer.json`, installing dependencies.

```

Platform.sh found a composer.json file in the repository tree, so it is going to
automatically fetch and install all the PHP dependencies.

```
      Executing post-build hook...
        Building...
        Success!

```
We supplied a build hook in `.platform.app.yaml`. Here, it is transforming scss
files to css. Build hooks are a good time to run anything that needs to change
files in the application's file system: the files will be read-only from now on,
such as during deploy hooks and when the environment is open.
```

      Executing pre-flight checks...

```
Platform.sh just ran some static security checks on the code, as a last line of
defense against a small list of especially severe security vulnerabilities. It
is possible to
[opt out](https://docs.platform.sh/user_guide/reference/protective-block.html)
of this, but one should only do that in case of false positives. Otherwise, it's
much safer to update the environment's so that the vulnerability is fixed.
```

      Compressing application.
      Beaming package to its final destination.

```

Building is over. Platform.sh creates an archive of the application and is going
to send it to one of the hosts on the grid where it will be mounted.

```
    Re-deploying environment mswy7hzcuhcjy-maximal.
```
The environment with all its applications has been deployed (here there is just
one), and Platform.sh will now give you an overview of its configuration.

If deploy hooks are defined, they'll runs during this deployment process. You
can find the associated log files by opening an
[SSH session](https://docs.platform.sh/user_guide/using/use-SSH.html) and
looking at `/var/log/deploy.log`.

```

      Environment configuration:
        myapp (type: php, size: S, disk: 200)
        cache (type: redis, size: S)
        database (type: mysql, size: S, disk: 200)
        moardatabase (type: postgresql, size: S, disk: 200)
        moarsearch (type: elasticsearch, size: S, disk: 200)
        search (type: solr, size: S, disk: 200)

```
We can see the 5 different data backends were deployed (started, and initialized
with the data from the parent environment). Platform.sh also configures a
networking environment that allows your application container to access them.

```
      Environment routes:
        http://maximal-mswy7hzcuhcjy.us.platform.sh/ is served by application `myapp`
        http://www---maximal-mswy7hzcuhcjy.us.platform.sh/ redirects to http://maximal-mswy7hzcuhcjy.us.platform.sh/
        https://maximal-mswy7hzcuhcjy.us.platform.sh/ is served by application `myapp`
        https://www---maximal-mswy7hzcuhcjy.us.platform.sh/ redirects to http://maximal-mswy7hzcuhcjy.us.platform.sh/
```

Lastly Platform.sh gives you the different routes that are served by your
application. Here, because this is a non-production environment, the routes are
mangled to ensure that it's possible to test each one: instead of www.<domain
name>, the environment is accessible at
`www---maximal-mswy7hzcuhcjy.us.platform.sh`, and you can see that in a browser.
The environment is now open and accessible to you.

```

To mswy7hzcuhcjy@git.us.platform.sh:mswy7hzcuhcjy.git
   31ed214..f32e741  maximal -> maximal
```
As a farewell, we're back to some normal git output, where the server tells you
what has been pushed.
