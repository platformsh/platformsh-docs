#Create a new development environment

We have a nice working site, now let's start working on. A bit of design goes
a long way. So let's add some.

The `master`  environment in Platform.sh is usually used for production. So lets
not hack on production but create a new branch.

We can do this in the CLI by running `platform environment:branch add-theme`
(make sure you `cd` in the your project's directory. "add-theme" here would be
the name of our new git branch.. and live environment.

With the Web Interface it is as easy.

![Platform Web Create Branch](/images/platform-web-create-branch.png)

Don't try to choose too fancy branch names : its limited to alphanumeric and a
dash (this will be part of the host name of the new environment so no funky
stuff).

Whether you did this on the CLI or on the Web interface you will have noticed
something very cool. The Web Interface reproduces everything in Real Time and
stays immediately up-to-date with whatever is happening on the command line.

... And we have a brand new test server! With its own url. Click on the link..
![Platform Web Branch Created Url](/images/platform-web-branch-created-url.png)
Its precisely the same as our "master" or "production" environment.
