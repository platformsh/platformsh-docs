# Git Driven Infrastructure

As a Platform as a Service or PaaS Platform.sh manages automatically everything your application needs in order to run. You don't need to setup anything manually. The web server is already setup and configured, as are any database, search engine or cache you might need. 

This means you only need to write your code, commit it to the Git source code management system and push it, with a couple of files that describe what are the requirements of your application, and the system will take care of everything else.

Managing your full stack, internally makes Platform.sh have some unique features:

1. All of your services (MySQL, ElasticSearch, MongoDB etc...) are managed inside the cluster and included in the price, no external single-points-of-failure. So when you backup you get a fully consistant snapshot of your whole application.
2. Multi-Services & Multi-App : you can deploy multiple applications (for example in micro-services style), using multiple data backends (MySQL, Postgres, Redis etc..) written in multiple frameworks (Drupal + NodeJS + Flask for example) in multiple languages in the same cluster.
3. Full cluster cloning technology : the full production cluster can be cloned in under a minute, with all of its data to create on the fly ephemeral development environments that are byte-level-copy of prodution, with all of its data.
4. Fail-Proof Deployments - every time you test a new feature you also test the deployment process.
5. Everything is build oriented with fully consistent and repeatable build process, allowing you to easily keep your applicaiton updated and secure.

[ image ]

Every branch you push is a fully running environment, complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything and its automatically generated URL can be sent to stakeholdes or to automated CI systems.  It really is “what would my site look like if I merged this to production?”  Every time.

You can use those concepts to replicate a traditional dev/stage/prod workflow, or to give every branch its own effective stage environment before merging to production.  Or have an intermediary integration branch for several other branches.  It’s entirely up to you.

In order to achieve these capabilities Platform.sh promotes some good practices (Always Be Compiling) and imposes some constraintes documented in the next chapters.