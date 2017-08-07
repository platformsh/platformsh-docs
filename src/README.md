# Introduction

Platform.sh is a second-generation Platform-as-a-Service built especially for continuous deployment. It allows you to host web applications on the cloud while making your development and testing workflows more productive.

If you're new to Platform.sh, we recommend starting with the **Big Picture**, in particular  [Structure](/overview/structure.md), and [How it works](/overview/how-it-works.md) will get you started on the right track to best leverage Platform.sh.

The main requirement of Platform.sh is that you use Git to manage your application code. Your project's configuration is driven almost entirely by a small number of YAML files in your Git repository.  The **Configuration** section covers those in more detail and can serve as both tutorial and quick-reference.

Platform.sh supports a number of different programming **Languages** and environments, and features recommended optimizations for a number of **Featured Frameworks**.

Finally, you can also get tips for setting up your own **Development** workflow, and **Administering** your Platform.sh account.

# Git Driven Infrastructure

As a Platform as a Service, or PaaS, Platform.sh automatically manages everything your application needs in order to run.  That means you can, and should, view your infrastructure needs as part of your application, and version-control it as part of your application.

## Infrastructure as code

Platform.sh covers not only all of your hosting needs but also most of your DevOps needs. It is a simple, single tool that covers the application life-cycle from development to production and scaling.

You only need to write your code, including a few YAML files that specify your desired infrastructure, commit it to Git, and push.  You don't need to setup anything manually. The web server is already setup and configured, as are any database, search engine or cache that you specify.

Every branch you push is a fully running environment &mdash; complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything &mdash; and its automatically generated URL can be sent to stakeholders or to automated CI systems.  It really is "what would my site look like if I merged this to production?"  Every time.

You can use those concepts to replicate a traditional development/staging/production workflow, or to give every feature its own effective staging environment before merging to production (empowering you to use git-flow like methodologies even better). You cold also have an intermediary integration branch for several other branches. Platform.sh respects the structure of branches. It’s entirely up to you.

## Full stack management

Managing your full stack internally gives Platform.sh some unique features:

1. All of your services (MySQL, ElasticSearch, MongoDB, etc...) are managed inside the cluster and included in the price, with no external single-points-of-failure. So when you backup you get a fully consistent snapshot of your whole application.
2. Multi-Services & Multi-App: you can deploy multiple applications (for example in micro-services style), using multiple data backends (MySQL, Postgres, Redis etc..) written in multiple frameworks (Drupal + NodeJS + Flask for example) in multiple languages in the same cluster.
3. Full cluster cloning technology: the full production cluster can be cloned in under a minute, with all of its data to create on the fly ephemeral development environments that are a byte-level-copy of production, with all of its data.
4. Fail-Proof Deployments: every time you test a new feature you also test the deployment process.
5. Everything is build oriented with fully consistent and a repeatable build process, allowing you to easily keep your application updated and secure.
