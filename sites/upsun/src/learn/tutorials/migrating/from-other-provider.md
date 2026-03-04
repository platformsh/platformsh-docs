---
title: from another provider
description: Learn how to migrate an application hosted on another provider to {{% vendor/name %}} so it is ready to deploy.
weight: 2
keywords:
  - "set remote"
---

This guide explains how to migrate an existing application from another hosting provider to {{% vendor/name %}}.

It focuses on the technical steps required to make your application deployable on {{% vendor/name %}}, including 
configuration, services, environment variables, and data migration.

No prior experience with {{% vendor/name %}} is needed—each step is explained simply, with examples and troubleshooting tips.

## Before you begin

You need:

- An understanding of the main [{{% vendor/name %}} concepts](/learn/overview.md)
- A {{% vendor/name %}} account.
  If you don't already have one, [register for a trial account](https://auth.upsun.com/register).
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your {{% vendor/name %}} account later.
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally

Follow the steps below to begin the migration of your project.

## 1. Audit your data from your current project
Before migrating, make sure you have access to:

- Your source code
- Your database
- Your assets and uploaded files

### Audit your current setup

{{< codetabs >}}
+++
title=from Self-Managed
+++

**Runtime & build**

- **Runtime version**: language and version in use (Node.js, Python, Ruby, PHP, etc.)
- **Package manager**: npm, yarn, pnpm, pip, composer, bundler, etc.
- **System dependencies**: packages installed via `apt`, `yum`, or similar
- **Build process**: how assets are compiled, if any (webpack, vite, sass, etc.)
- **How the app starts**: systemd unit, supervisor config, pm2, Docker entrypoint, etc.
- **Reverse proxy**: nginx, Apache, or Caddy config (rewrites, headers, timeouts, SSL termination)

**Processes & scheduling**

- **Background workers**: how they are started and supervised
- **Cron jobs**: run `crontab -l` to list all scheduled tasks

**Environment & secrets**

- **Environment variables**: run env on your server to list them
- **`.env` files**: check for any local env files used at runtime
- **SSL certificates**: Let's Encrypt, manual certs, or managed by proxy

**Data & storage**

- **Database engine and version**: PostgreSQL, MySQL, MongoDB, etc.
- **Writable folders**: directories your app writes to at runtime (uploads, cache, logs)
- **Backup strategy**: how and where backups are currently stored

**Access**

- **Users and teams**: who currently has access to the server and application
- **SSH access**: confirm you can connect to export data

<--->
+++
title=from Heroku
+++

**Audit your Heroku setup**:

**App/runtime/build**

- **Stack & runtime versions**: current stack (`heroku stack`), Node/Python/Ruby/etc versions, package manager (npm/yarn/pnpm), locked deps.
- **Slug/build behavior**: anything relying on Heroku’s slug compilation quirks, `postinstall`, `release` phase, `heroku-postbuild`.
- **Build vs run separation**: what gets generated at build time (assets, SSR bundles) vs needs runtime write access.

**Processes, jobs, scheduling**

- **Release phase scripts** (Procfile `release`): DB migrations, cache warmups, etc.
- **Heroku Scheduler** jobs (often forgotten) + any custom cron-like jobs.
- **Workers/queues**: what queue system (Redis/Rabbit/etc), concurrency settings, retry policies.

**Networking, routing, and platform features**

- **Routes/HTTP behavior**: any reliance on Heroku router timeouts, request body size limits, websockets, sticky sessions (rare), streaming.
- **Outbound networking**: external integrations with IP allowlists; need for stable egress IPs.
- **SSL/TLS details**: ACM vs manual certs, SNI endpoints, any HSTS / security headers configured elsewhere (CDN/WAF).

**Data & state**

- **Datastores & backups**: Postgres plan/features (extensions, follower, PITR), Redis plan, backup/restore flows, retention.
- **File storage**: any use of ephemeral filesystem (tmp/uploads) that should be moved to object storage.
- **Caches**: in-memory assumptions, Redis usage patterns, cache invalidation strategy.

**Observability & ops**

- **Logging drains**: Papertrail/Datadog/Splunk drains + formats, PII controls.
- **Metrics/APM**: add-ons and config, alert rules, SLOs.
- **Error tracking**: Sentry/Rollbar, release tagging.

**Delivery and environments**

- **Pipelines & review apps**: how staging/prod are promoted, config var diffs, Heroku CI.
- **GitHub integration**: auto-deploy branches, required checks.
- **Regions**: app region + data region alignment, compliance constraints.

**Access & governance**

- **SSO / permissions model**: Enterprise features, team roles, API tokens in CI.
- **Secrets handling**: where secrets live (Heroku config vars, CI, Vault), rotation plan.

<--->
+++
title=from Vercel
+++

**Project structure & build**

- **Framework + version** (Next.js, Nuxt, SvelteKit, etc.) and Vercel build preset.
- **Build & Output settings**: build command, install command, output directory, ignored build step.
- **Monorepo setup**: root directory, workspace tool (pnpm/yarn/npm), Turbo/Nx config, package manager version.
- **Node/runtime versions**: Node version, edge runtime usage, any experimental flags.

**Routing & edge behavior (must map cleanly)**

- **Rewrites/redirects/headers** (`Vercel.json` / `next.config`): including regex rules and priority order.
- **Middleware usage** (Next.js middleware): what it does (auth, geo, A/B, rewrites).
- **Edge Functions** vs **Serverless Functions**: which endpoints run where and why.
- **Regional settings**: functions/edge regions and latency expectations.

**Rendering model**

For Next.js especially, inventory exactly which parts are:

- **SSG** pages
- **SSR** pages
- **ISR** pages (revalidate timings, on-demand revalidation hooks)
- **Route Handlers / API routes**
- **Image Optimization** (`next/image`) usage:
  
This determines whether you need a long-running web process, background jobs, cache, and/or a CDN strategy.

**Environment variables & secrets**

- **Env vars per environment** (Production / Preview / Development) and which are "encrypted" / "sensitive".
- **Preview env overrides**: anything that only exists on preview deployments.
- **Secret sources**: Vercel integrations, Vercel-managed secrets, external vaults.

**Storage & state (Vercel add-ons / managed services)**

- **Vercel Postgres / KV / Blob** usage, connection methods, pooling, migrations.
- **Any external DB** (Supabase/RDS/etc): connection limits, pooling, IP allowlists.
- **File uploads**: where do uploads go (Blob/S3/etc)? Any code writing to local disk (won’t persist).

**Scheduled and async work**

- **Vercel Cron Jobs**: schedules, endpoints called, auth strategy.
- **Background processing**: do you rely on queueing elsewhere? Any long-running tasks incorrectly placed in serverless functions?

**Limits & performance assumptions**

- **Function timeouts/memory** assumptions (serverless) and payload size constraints.
- **Caching strategy**: Vercel/CDN cache headers, Next fetch caching, ISR cache behavior.
- **Build cache** expectations and cold-start sensitivity.

**Domains, deploys, and release workflow**

- **Domains + redirects + canonical host** rules, wildcard domains, multiple apps behind one domain.
- **Preview deployments**: how they’re used (QA, PR checks), who needs access, protected previews.
- **Git integration**: which repos/branches deploy, required checks, auto-promote patterns, deploy hooks/webhooks.

**Observability & access**

- **Logs/analytics**: Vercel Analytics, Speed Insights, log drains (if any), retention needs.
- **Team access**: members, roles, SSO, tokens used by CI/CD.

{{< /codetabs >}}

### How {{% vendor/name %}} maps to your existing architecture

When migrating from another platform, map your existing components to {{% vendor/name %}} concepts.

| Existing platform concept          | {{% vendor/name %}} equivalent                                      |
|------------------------------------|---------------------------------------------------------------------|
| Web dyno / server                  | [Application Container](/learn/overview/structure.md#apps)          |
| Worker dyno                        | [Worker](/create-apps/image-properties/workers.md)                  |
| Add-on database                    | [Service](/add-services.md)                                         |
| Environment variables              | [Environment variables](/development/variables.md)                  |
| Upload storage                     | [Mounts](/create-apps/image-properties/mounts.md)                   |
| Cron jobs / Heroku Scheduler       | [Crons](/create-apps/image-properties/crons.md)                     |
| Domains                            | [Routes](/define-routes.md)                                         |
| Buildpacks                         | [build hooks](/create-apps/image-properties/hooks.md)               |
| Review apps / preview deployments  | [Preview environments](/glossary.md#preview-environment)            |
| SSL certificates                   | [automatic TLS](/define-routes/https.md#tls-certificates) (managed) |

## 2. Clone your Git repository locally
As a start, you need to clone your source code locally to make it {{% vendor/name %}} ready.

```bash {location="Terminal"}
git clone <REPOSITORY_URL> your-app-directory
cd your-app-directory
```

## 3. Initialize {{% vendor/name %}} configuration

A {{% vendor/name %}} project is configured through the `.upsun/config.yaml` file.  
This file defines your applications, services, routes, and runtime configuration.

{{% vendor/name %}} provides a [CLI `project:init` command](/administration/cli/init.html).

```bash {location="Terminal"}
{{% vendor/cli %}} project:init
```
This command initializes your {{% vendor/name %}} project configuration. 
If you choose `With AI (automatic)`, it detects your app’s requirements and creates a config file for you.

## 4. Create a new {{% vendor/name %}} project

{{< codetabs >}}

+++
title=Using the CLI
+++

If you do not already have an organization created on {{% vendor/name %}}, create one:

```bash
{{% vendor/cli %}} org:create
```
Then run the following command to create a project:

```bash
{{% vendor/cli %}} project:create
```
When prompted, fill in details like the project name, [region](/development/regions.md), and the name of your organization.

<--->
+++
title=Using the Console
+++

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

If you do not already have an organization created to put the project, you'll first be instructed to create one.

Once you have done so, select that organization from the dropdown, and select **Create from scratch**.

In the form, fill in details like the project name and [region](/development/regions.md).
You'll be able to define resources for the project after your first push.

{{< /codetabs >}}

{{% note theme="info" %}}
Before migrating your production environment, we recommend pushing to a separate 
branch first. {{% vendor/name %}} automatically creates a [preview environment](/glossary.md#preview-environment) for 
each branch, allowing you to validate your configuration, services, and data 
before switching any production traffic.
{{% /note %}}

## 5. Configure services and start commands

### Configure your services
In your {{% vendor/name %}} project, you can add as many services as you need.

List your current services in use and add them in the configuration, following the corresponding [Service page](/add-services/#available-services).

As an example, if your current project is using [PostgreSQL](/add-services/postgresql.md) and [Redis](add-services/redis.md), 
edit your `.upsun/config.yaml` file and add the following:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  myapp: 
    relationships:
      database:
      cache:
services:
  database:
    type: postgresql:16
  cache:
    type: redis:7.2
```
<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  myapp: 
    relationships:
      database:
        service: postgresl_service
        endpoint: postgresql
      cache:
        service: redis_service
        endpoint: redis
services:
  postgresl_service:
    type: postgresql:16
  redis_service:
    type: redis:7.2        
```
{{< /codetabs >}}

{{% note theme="info" %}}
You need to declare your services in the `services` top YAML key and add a [`relationships`](/create-apps/image-properties/relationships.md) for each services in your 
`myapp` configuration. [Service environment variables](/development/variables/#service-environment-variables) will be automatically injected in your `myapp` container to interact with.
{{% /note %}}

### Configure how your application and workers starts

{{< codetabs >}}
+++
title=from Self-Managed
+++

Find out how your current application is started 
and convert it to an {{% vendor/name %}} configuration. 

- how you start your runtime should go in the `myapp.web.commands.start`
- how you start your worker should go in the `myapp.workers.<WORKER_NAME>.commands.start`

Example: 
```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    type: "python:3.12"
    web:
      commands:
        start: "gunicorn app:app --workers 4 --bind 0.0.0.0:$PORT"
    workers:
      celery:
        commands:
          start: "celery -A tasks worker --loglevel=info"
```

<--->
+++
title=from Heroku
+++

Heroku applications typically define processes in a `Procfile`.

On {{% vendor/name %}}, these processes are defined in `.upsun/config.yaml`
using the [`web` section](/create-apps/image-properties/web.md) for the HTTP entrypoint and 
[`workers`](/create-apps/image-properties/workers.md) for background processes.

Transform your process definitions. If your Procfile has:

```yaml {location="Procfile"}
web: gunicorn app:app --workers 4
worker: celery -A tasks worker --loglevel=info
```

Your `.uspun/config.yaml` should include these command in the `commands.start` section:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    type: "python:3.12"
    web:
      commands:
        start: "gunicorn app:app --workers 4 --bind 0.0.0.0:$PORT"
    workers:
      celery:
        commands:
          start: "celery -A tasks worker --loglevel=info"
```

<--->
+++
title=from Vercel
+++

Applications deployed on Vercel often rely on serverless functions and edge features.

On {{% vendor/name %}}, these workloads typically run as a persistent web process 
inside an application container. Unlike serverless functions, the process stays alive 
between requests, which changes how you think about memory, state, and concurrency.

Identify the main entrypoint of your application.

For example, a Next.js application usually runs with:

```bash
npm run start
```

You can define this command in `.upsun/config.yaml`:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    type: "nodejs:20"
    web:
      commands:
        start: "npm run start"
```

If your project includes background jobs or queue consumers, define them as workers:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    workers:
      jobs:
        commands:
          start: "node worker.js"
```

You may also need to review features that rely on Vercel platform behavior such as:

- Edge middleware
- Serverless API routes
- Incremental static regeneration (ISR)
- Vercel image optimization

These features may require application-level implementations when running on {{% vendor/name %}}.

{{< /codetabs >}}

## 6. Configure build and deploy hooks

If you have custom build steps, define them explicitly in the `hooks.build` and `hooks.deploy` section:

Example: 

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    hooks:
      build: |
        pip install -r requirements.txt
        python manage.py collectstatic --noinput
      deploy: |
        python manage.py migrate --noinput
```

{{% note theme="warning" %}}
The app container is fully writable during the `build` hooks and is readonly during the `deploy` hooks. 
During the `deploy` hooks, only defined [mounts](/create-apps/image-properties/mounts.md) are writable.
{{% /note %}}

## 7. Define Mounts

Define your [mounts](/create-apps/image-properties/mounts.md) (aka. writable folders) in `.upsun/config.yaml`:

```yaml {location=".upsun/config.yaml"}
applications:
  myapp:
    mounts:
      'web/uploads':
        source: storage
        source_path: uploads
      'private':
        source: instance
        source_path: private
```

Please refer to [supported mount type](/create-apps/image-properties/mounts.md#define-a-mount) for more information.

## 8. Define routes

If you are migrating a [multi-application project](/create-apps/multi-app.md), or want to customize how your application is served,
you need to [configure routes](/define-routes.md). 


## 9. Optional: Define a resource initialization strategy

By default, when you first deploy your project,
{{% vendor/name %}} allocates [default resources](/manage-resources/resource-init.md) to each of your containers.
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init.md#specify-a-resource-initialization-strategy) before pushing your code.

Alternatively, you can [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

## 10. Optional: Add environment variables

If your app requires [Environment variables] to build properly, [add them to your environment](/development/variables/set-variables.md).

Extract existing environment variables in your project:

{{< codetabs >}}
+++
title=from Self-Managed
+++

SSH to your server and Use the `env` CLI command to list all your existing environment variable:
```bash {location="Terminal"}
ssh <YOUR-SERVER-IP>
env # it displays your environment variables
```

<--->
+++
title=from Heroku
+++

List your Heroku environment variables using the CLI: 

```bash {location="Terminal"}
heroku config # it displays your environment variables
```

<--->
+++
title=from Vercel
+++

List your Vercel environment variables using the CLI:

```bash {location="Terminal"}
Vercel env ls # it displays your environment variables
```

You can retrieve the value of a variable with:

```bash {location="Terminal"}
Vercel env pull
```
This command writes environment variables to a `.env` file locally.

{{< /codetabs >}}

Review the variables and recreate them in {{% vendor/name %}} using [`variable:create`](/administration/cli/reference.md#variablecreate).

```bash {location="Terminal"}
# Review and set in {{% vendor/name %}} with env: prefix for standard environment variables 
{{% vendor/cli %}} variable:create --level environment --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
# Or for project-wide variables
{{% vendor/cli %}} variable:create --level project --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
# Or for application specific variables
{{% vendor/cli %}} variable:create --app-scope myapp --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
```

{{% note theme="info" %}}
For sensitive values, be sure to add the `--sensitive true` option to avoid exposing any confidential information.
{{% /note %}}

## 11. Push your changes

The way to push your code to {{% vendor/name %}} depends on
whether you're hosting your code with a third-party service using a [source integration](/integrations/source/_index.md).
If you aren't, your repository is hosted in {{% vendor/name %}}
and you can use the CLI or just Git itself.

{{% note theme="info" %}}
At this stage, ensure you've already committed your updated files (mainly `.upsun/config.yaml`) in your Git history, using: 
```bash {location="Terminal"}
git add .upsun/config.yaml 
git commit -m "Add Upsun configuration file"
```
{{% /note %}}

{{< codetabs >}}
+++
title=Using the CLI
+++

1. (Optional) Get your project ID by running the following command:

  ```bash
  {{% vendor/cli %}} projects
  ```

2. (Optional) Add {{% vendor/name %}} as a remote repository by running the following command:

  ```bash
  {{% vendor/cli %}} project:set-remote {{< variable "PROJECT_ID" >}}
  ```

3. Push to the {{% vendor/name %}} repository by running the following command:


  ```bash
  {{% vendor/cli %}} push
  ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

<--->
+++
title=Using a source integration
+++

Set up the integration for your selected service:

- [Bitbucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)


Then push code to that service as you do normally.
Pushing to a branch creates an environment from that branch.

Note that the source integration doesn't report any errors in configuration directly.
You have to monitor those in your project activities.

<--->
+++
title=Using Git
+++

1.  Add an [SSH key](/development/ssh/ssh-keys.md).
2.  In the Console, open your project and click **Code {{< icon chevron >}}**.
3.  Click **Git**.
4.  From the displayed command, copy the location of your repository.
  It should have a format similar to the following:


  ```text
  abcdefgh1234567@git.eu.{{< vendor/urlraw "host" >}}:abcdefgh1234567.git
  ```

5.  Add {{% vendor/name %}} as a remote repository by running the following command:

  ```bash
  git remote add {{% vendor/cli %}} {{< variable "REPOSITORY_LOCATION" >}}
  ```

6.  Push to the {{% vendor/name %}} repository by running the following command:

  ```bash
  git push -u {{% vendor/cli %}} {{< variable "DEFAULT_BRANCH_NAME" >}}
  ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

{{< /codetabs >}}

{{% note theme="info" %}}
If your application is deployed without error but you get a 502 error when loading your application, [refer to the Troubleshoot page](/development/troubleshoot.md). 
{{% /note %}}

## 12. Test your production environment
When your {{% vendor/name %}} project is successfully deployed: 

- **Verify service connections**: 
  - Check database connectivity 
  - Verify cache operations 
  - Test background worker execution
- **Load testing**: Run a load test against your {{% vendor/name %}} environment 
  before switching DNS to validate performance under realistic traffic. 
  Tools like [k6](https://k6.io), [Locust](https://locust.io), or 
  [Gatling](https://gatling.io) can be used for this purpose.
- **Review logs and metrics**:

```bash {location="Terminal"}
{{% vendor/cli %}} logs app
{{% vendor/cli %}} metrics:all
```
- **Verify functionality**: 
  - Test critical user flows 
  - Confirm integrations working 
  - Check scheduled jobs executing

## 13. Enable maintenance mode
Before importing data and switching DNS, enable maintenance mode in your application if it supports it.
This prevents users from writing new data to your old environment during the cutover, avoiding data loss or inconsistencies.

{{% note theme="warning" %}}
Do not skip this step if your application is live and receiving traffic. Any writes to your old environment after the database export will be lost.
{{% /note %}}

## 14. Import data

Once you have an environment ready and maintenance mode is enabled, import the data from your current provider.
The exact process depends on the database engine you use.

{{< codetabs >}}
+++
title=from Self-Managed
+++

Depending on the database engine you're using, download a dump of your database into a SQL file locally
and import it into your application container.

<--->
+++
title=from Heroku
+++
**Option 1**: Export as SQL directly (recommended)

```bash {location="Terminal"}
DATABASE_URL=$(heroku config:get DATABASE_URL)
pg_dump -Fp --no-owner --clean --if-exists $DATABASE_URL > database.sql
```

**Option 2**: If you have an existing custom format backup

```bash {location="Terminal"}
heroku pg:backups:capture
heroku pg:backups:download
pg_restore -f database.sql --no-owner --clean --if-exists latest.dump
```

<--->
+++
title=from Vercel
+++

If your Vercel project uses an external database (for example Supabase, Neon, or PlanetScale),
export the database using the appropriate tool for your database engine.

For PostgreSQL:

```bash {location="Terminal"}
pg_dump -Fp --no-owner --clean DATABASE_URL > database.sql
```

For MySQL:

```bash {location="Terminal"}
mysqldump --single-transaction DATABASE_NAME > database.sql
```

{{< /codetabs >}}

Then import the dump using the {{% vendor/name %}} CLI.

```bash
{{% vendor/cli %}} sql < {{< variable "BACKUP_FILE_NAME" >}}
```

{{% note theme="info" %}}
If you have multiple database services, target a specific one with `--relationship=<RELATIONSHIP_NAME>`.
{{% /note %}}

For any potential more details, see the [specific service documentation](/add-services/_index.md).

## 15. Import files

Your app may include content files, meaning files that aren't intended to be part 
of your codebase and therefore aren't tracked in Git.

You can upload such files to [mounts you created](/create-apps/image-properties/mounts.md).

Assuming you have the following mounts:

```yaml {configFile="app"}
applications:
 myapp:
   mounts:
     'web/uploads':
       source: storage
       source_path: uploads
     'private':
       source: instance
       source_path: private
```

Upload each mount separately:

```bash
{{% vendor/cli %}} mount:upload --mount web/uploads --source ./uploads
{{% vendor/cli %}} mount:upload --mount private --source ./private
```

Alternatively, you can transfer files using an [SSH client](/development/file-transfer.md#transfer-files-using-an-ssh-client).

## 16. Configure your Domain and update DNS records

### Lower your TTL in advance

{{% note theme="warning" %}}
Before switching DNS, lower your domain's TTL to 300 seconds (5 minutes) at least 24 hours in advance.
This reduces propagation delay during cutover and makes it easier to roll back quickly if needed.
{{% /note %}}

Add your domain to {{% vendor/name %}}

```bash {location="Terminal"}
{{% vendor/cli %}} domain:add www.yourDomain.com
```

Get your {{% vendor/name %}} target URL:
```bash {location="Terminal"}
{{% vendor/cli %}} environment:url
```

### Update your DNS records
Add a `CNAME` record in your DNS provider pointing your domain to the URL returned above.

Once DNS has propagated, verify your domain resolves correctly and your application loads as expected before disabling maintenance mode.

{{% note theme="info" %}}
DNS propagation can take up to 48 hours depending on your provider and previous TTL value.
You can monitor propagation using a tool like dnschecker.org.
{{% /note %}}

### Rollback plan
If something goes wrong after the DNS switch, you can revert quickly:

* Point your `CNAME` back to your old provider's URL
* Re-disable maintenance mode on your old environment
* Investigate the issue on {{% vendor/name %}} before retrying

Keep your old environment live and intact until you have fully validated the migration.

## 17. Invite teams and users

You can either invite individual users to your project, or create teams, and then invite users in teams (recommended).

### Create a team and invite users in a team
We recommend to create a team and invite individual users in this team, as you would be able to manage access at the team level, instead of one-by-one users.

When creating a team for a project, a role is required: 

- at the Project level: `admin` or `viewer`
- for each environment types (`production`, `staging` and `development` ): `admin`, `contributor` or `viewer`

To create a team, you can either use the Console or the CLI:

```bash {location="Terminal"}
{{% vendor/cli %}} team:create --role viewer,production:viewer,staging:contributor,development:admin --label "My team"
```

To invite a user to a team, you can either use the Console or the CLI, and provide the user ID (if existing user) or the email address (we will send him an invitation):

```bash {location="Terminal"}
{{% vendor/cli %}} team:user:add {{< variable "USER_EMAIL_ADDRESS_OR_ID" >}}
```

{{% note theme="info" %}}
Each user invited in a team inherits the team's role.
{{% /note %}}

### Invite users

When inviting individual users on a project, a role is required: 

- at the [Project level](/administration/users.md#project-roles): `admin` or `viewer`
- for each [Environment types](/administration/users.md#environment-type-roles) (`production`, `staging` and `development` ): `admin`, `contributor` or `viewer`

To invite individual users on a project, use the following CLI command:

```bash {location="Terminal"}
{{% vendor/cli %}} user:add --role viewer,production:viewer,staging:contributor,development:admin {{< variable "USER_EMAIL_ADDRESS" >}}
```

## 18. Monitor your application

Once your application is live, make sure to check out the [continuous profiling](/increase-observability.md) feature 
to ensure your application is running as expected.

## Troubleshooting common migration issues

If you encounter any error during the migration, please refer to the [Troubleshoot page](/development/troubleshoot.md)
