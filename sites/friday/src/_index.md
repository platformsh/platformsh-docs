---
title: Introduction
showTitle: false
feedback: false
---

{{< home >}}

## What is Deploy Friday?

{{< vendor/name >}} is a second-generation Platform-as-a-Service built especially for continuous deployment.
It allows you to host web applications on the cloud while making your development and testing workflows more productive.

If you're new to {{< vendor/name >}}, we recommend starting with the **Big Picture**, in particular [Structure](/overview/structure.md), and [Build & Deploy](/overview/build-deploy.md) will get you started on the right track to best use {{< vendor/name >}}.

The main requirement of {{< vendor/name >}} is that you use Git to manage your application code.
Your project's configuration is driven almost entirely by a small number of YAML files in your Git repository.
The **Configuration** section covers those in more detail and can serve as both a tutorial and a quick reference.

{{< vendor/name >}} is built on Debian, supports many different programming **Languages** and environments,
and features recommended optimizations for several **Featured Frameworks**.

Finally, you can also get tips for setting up your own **Development** workflow and **Administering** your {{< vendor/name >}} account.

### `app` file

```yaml {configFile="app"}
{{% snippet name="static-site" config="app" %}}
# The type of the application to build.
type: "nodejs:18"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet placeholder="true" config="service" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `apps` file

```yaml {configFile="apps"}
{{% snippet name="static-site" config="apps" %}}
# The type of the application to build.
type: "nodejs:{{% latest "nodejs" %}}"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet name="another-site" config="apps" globKey="false" %}}
# The type of the application to build.
type: "nodejs:{{% latest "nodejs" %}}"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet placeholder="true" config="service" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `services` file


```yaml {configFile="services"}
{{% snippet name="mariadb" config="service" %}}
    type: mariadb:{{% latest "mariadb" %}}
    disk: 256
{{% /snippet %}}
{{% snippet name="redis" config="service" globKey="false" %}}
    type: redis:{{% latest "redis" %}}
{{% /snippet %}}

{{% snippet placeholder="true" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `routes` file

```yaml {configFile="routes"}
{{% snippet name="static-site" config="route" subDir="api" %}}
    cache:
        enabled: true
        headers: ['Accept', 'Accept-Language', 'X-Language-Locale']
        cookies: ['*']
        default_ttl: 60
{{% /snippet %}}
{{% snippet placeholder="true" /%}}
{{% snippet placeholder="true" config="service" /%}}
```

### Git Driven Infrastructure

As a Platform as a Service, or PaaS, {{< vendor/name >}} automatically manages everything your application needs to run.
That means you can, and should, view your infrastructure needs as part of your application and address them under version control.

### Infrastructure as code

{{< vendor/name >}} covers not only all of your hosting needs but also most of your DevOps needs. It is a single tool that covers the application life-cycle from development to production and scaling.

You only need to write your code, including a few YAML files that specify your desired infrastructure, commit it to Git, and push.
You don't need to set up anything manually. The web server is already set up and configured, as is any database, search engine, or cache that you specify.

Every branch you push can be made a fully independent environment&mdash;complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything.
Its automatically generated URL can be sent to stakeholders or automated CI systems.
It really is "what would my site look like if I merged this to production?" every time.

You can use these concepts to replicate a traditional development/staging/production workflow or even to give every feature its own effective staging environment before merging to production (empowering you to use git-flow like methodologies even better). You could also have an intermediary integration branch for several other branches.

{{< vendor/name >}} respects the structure of branches. It's entirely up to you.

### Full stack management

Managing your full stack on {{< vendor/name >}} gives you the following unique features:

1. **Unified Environment:** All of your services (MySQL, ElasticSearch, MongoDB, etc.) are managed inside the cluster and included in the price, with no external single-points-of-failure. When you back up an environment, you get a fully consistent snapshot of your whole application.
2. **Multi-Services & Multi-App:** You can deploy multiple applications (for example, in a microservice-based architecture), using multiple data backends (MySQL, PostgreSQL, Redis, etc.) written in multiple frameworks (Drupal + NodeJS + Flask, for example) in multiple languages, all in the same cluster.
3. **Full Cluster Cloning Technology:** The full production cluster can be cloned in under a minute&mdash;including all of its data&mdash;to create on-the-fly, ephemeral development environments that are a byte-level copy of production.
4. **Fail-Proof Deployments:** Every time you test a new feature, you also test the deployment process.
5. **Continuous Deployment from the Start:** Everything is build-oriented, with a consistent, repeatable build process, simplifying the process of keeping your application up-to-date and secure.
