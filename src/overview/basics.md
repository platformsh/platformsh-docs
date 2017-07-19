# Git Driven Infrastructure

As a Platform as a Service, or PaaS, Platform.sh automatically manages everything your application needs in order to run.  That means you can, and should, view your infrastructure needs as part of your application, and version-control it as part of your application.

## Infrastructure as code

Platform.sh covers not only all of your hosting needs but also most of your DevOps needs. It is a simple, single tool that covers the application life-cycle from development to production and scaling.

You only need to write your code, including a few YAML files that specify your desired infrastructure, commit it to Git, and push.  You don't need to setup anything manually. The web server is already setup and configured, as are any database, search engine or cache that you specify.

Every branch you push is a fully running environment &mdash; complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything &mdash; and its automatically generated URL can be sent to stakeholders or to automated CI systems.  It really is "what would my site look like if I merged this to production?"  Every time.

You can use those concepts to replicate a traditional development/staging/production workflow, or to give every feature its own effective staging environment before merging to production (empowering you to use git-flow like methodologies even better). You cold also have an intermediary integration branch for several other branches. Platform.sh respects the structure of branches. It’s entirely up to you.

## Always Be Compiling

Interpreted languages like PHP or Node.js may not seem like they have to be compiled, but with modern package management tools like Composer or npm and with the growing use of CSS preprocessors such as Sass, most modern web applications need a "build" step between their source code and their production execution code.  At Platform.sh, we aim to make that easy.  That build step includes the entire application container, from language version to build tools to your code, rebuilt every time.

That [build process](/overview/how-it-works.md) is under your control, and reruns on every Git push.  Every Git push is a validation not only of your code but of your build process.  Whether that's installing packages using Composer or Bundler, compiling TypeScript or Sass, or building your application code in Go or Java, your build process is vetted every time you push.

## Many benefits

Managing your full stack internally gives Platform.sh some unique features:

1. All of your services (MySQL, ElasticSearch, MongoDB, etc...) are managed inside the cluster and included in the price, with no external single-points-of-failure. So when you backup you get a fully consistent snapshot of your whole application.
2. Multi-Services & Multi-App: you can deploy multiple applications (for example in micro-services style), using multiple data backends (MySQL, Postgres, Redis etc..) written in multiple frameworks (Drupal + NodeJS + Flask for example) in multiple languages in the same cluster.
3. Full cluster cloning technology: the full production cluster can be cloned in under a minute, with all of its data to create on the fly ephemeral development environments that are a byte-level-copy of production, with all of its data.
4. Fail-Proof Deployments: every time you test a new feature you also test the deployment process.
5. Everything is build oriented with fully consistent and a repeatable build process, allowing you to easily keep your application updated and secure.
