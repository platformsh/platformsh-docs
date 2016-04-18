# Step by step walkthrough of `git push` output
To better grasp what is happening here we will show you what the output
of the `git push` command might look like with Platform.sh

Platform.sh is extremely versatile .. so for each project and  depending
on the state of the project the output can vary wildly. But this can give
you an idea.

In this case we have a PHP project with a lot of data backends, it uses MySQL,
PostGres, Redis and ElasticSearch. It has its PHP dependencies in a 
`composer.json` file and it uses the Ruby library "sass" to compile the SCSS
during its build process.

The developer wanted to work on a new feature so they created a new environment by
running `platform environment:branch maximal`. "maximal" is the name of the 
branch.

After modifying some files the developer pushed the changes using:

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
conflict it would have errored out and asked you to resolve it.

```
Validating submodules.
```
Platform.sh supports git submodules and supports multiple applications. (So you
can have multiple applications, each in its own git repository, but have a 
single production environment for all of them.) In this case we only have a 
single application and no git submodule.

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

Happy with what it got it is going to start building your application(s).

```
    Building application 'myapp' (runtime type: php, tree: 551ee89)
      Generating runtime configuration.
```

Based on what you put in your `.platform.app.yaml`, it is going to build for each
application a container with the correct configuration.

```
      Installing build dependencies...
        Installing ruby build dependencies: sass
```
In this case we have a dependency on the Ruby sass library so it has installed 
it. (Again, this comes from `.platform.app.yaml`.)

```
      Found a `composer.json`, installing dependencies.

```

Platform.sh found a composer.json file so it is going to automatically fetch
and install all the PHP dependencies.

```
      Executing post-build hook...
        Building...
        Success!

```
We supplied a build hook in `.platform.app.yaml` (here it is transforming scss
files to css). It is a good time to run  anything that needs to change the main
file system. (Because after the build hook, it will turn read-only.)
```

      Executing pre-flight checks...

```
Platform.sh just ran some static security checks on the code. There are some 
vulnerabilities it will refuse to deploy. (You can force it but its not a good
idea.)
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
one) and Platform.sh will now give you an overview of its configuration.

You will not be able to see output from the "deploy" hook as these happen in
the context of the deployed application. But you could ssh to the environment
and inspect the log files.

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
with the data from the parent environment). Platform.sh also  configured the 
network so your application container can access them.

```
      Environment routes:
        http://maximal-mswy7hzcuhcjy.us.platform.sh/ is served by application `myapp`
        http://www---maximal-mswy7hzcuhcjy.us.platform.sh/ redirects to http://maximal-mswy7hzcuhcjy.us.platform.sh/
        https://maximal-mswy7hzcuhcjy.us.platform.sh/ is served by application `myapp`
        https://www---maximal-mswy7hzcuhcjy.us.platform.sh/ redirects to http://maximal-mswy7hzcuhcjy.us.platform.sh/
```

Lastly Platform.sh gives you the different routes that are served by your 
application. Here you can see the "mangled" routes on a non-live environment
where the `www.` part was replaced by `www---` you can visit those in a
browser. The site is up and running.

```

To mswy7hzcuhcjy@git.us.platform.sh:mswy7hzcuhcjy.git
   31ed214..f32e741  maximal -> maximal
```
and as a farewell we are back to some normal git output, where the server tells
you at what commit level it is now.

And all of that... happens really, really fast.

