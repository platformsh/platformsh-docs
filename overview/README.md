What is Platform.sh?
====================

[Platform.sh](https://platform.sh/) is a groundbreaking hosting and
development tool for web applications. It extends a branch-merge Git
workflow to infrastructure so that every branch has its own URL and can
be tested as if it were in production. Platform.sh architecture allows
it to scale for the largest sites.

How does it work?
-----------------

Platform.sh operates on the idea that you as a web developer will manage
your application code in Git. From there, Platform.sh can provision each
Git branch with a full application stack to run your application,
online, with a synchronized copy of the application's data (*DB, files,
Solr index...*)

This means that you now can work with your complete application
infrastructure the same way you work with Git: branching and merging is
cheap and fast, and you are no longer responsible for the system
administration or DevOps tasks that distract from coding.

How is it different?
--------------------

Platform.sh is **built around a Continuous Integration model**, so new
features and fixes can be integrated quickly and easily, rather than
forcing delays waiting for scheduled batch deployments. That means less
waiting for code changes to go live, whether they be tiny tweaks or
brand new functionality.

