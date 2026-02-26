---
title: from another provider
description: Learn how to migrate your app, hosted on another provider to work on an {{% vendor/name %}} project so that it's deployment-ready.
weight: 2
keywords:
  - "set remote"
---

This guide will walk you through migrating your app to {{% vendor/name %}}, step by step. 
No prior experience with {{% vendor/name %}} is needed—each step is explained simply, with examples and troubleshooting tips.

## Before you begin

You need:

- Understand main [Up{{% vendor/name %}}sun concepts](/learn/overview.md)
- A {{% vendor/name %}} account.
  If you don't already have one, [register for a trial account](https://auth.upsun.com/register).
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your {{% vendor/name %}} account later.
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally

Follow the steps below to begin the migration of your project.

## 1. Export your data from your actual project
On your actual project, make sure you have access to:

- Access to your source code
- Access to your database
- Access to your assets

{{< codetabs >}}
+++
title=from DIY
+++

Audit your actual setup: 

- Document all add-ons and their configurations
- List all config vars
- Review Profile and identify all process types 
- Check buildpack configuration
- Document custom domains and SSL certificates
- List folders where your application needs write access
- List users and teams having access to your application

<--->
+++
title=from Heroku
+++

Audit your Heroku setup: 

- Document all add-ons and their configurations 
- List all config vars (`heroku config`)
- Review Profile and identify all process types 
- Check buildpack configuration (`heroku buildpacks`) 
- Document custom domains and SSL certificates
- List folders where your application needs write access
- List users and teams having access to your application

<--->
+++
title=from vercel
+++

TBD

{{< /codetabs >}}

## 2. Clone your Git repository locally
As a start, you need to clone your source code locally to make it {{% vendor/name %}} ready.

```bash {location="Terminal"}
git clone <REPOSITORY_URL> your-app-directory
cd your-app-directory
```

## 3. Initialize {{% vendor/name %}} configuration

{{% vendor/name %}} project needs a `.upsun/config.yaml` file to configure what's served.

{{% vendor/name %}} provides a [CLI `project:init` command](/administration/cli/init.html).

```bash {location="Terminal"}
{{% vendor/cli %}} project:init --ai
```
This command initializes your {{% vendor/name %}} project configuration. It detects your app’s requirements and creates a config file for you.

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

## 5. Finetune your configuration 

### Configure your services
In your {{% vendor/name %}} project, you can add as many services as you need.

List your actual services in use and add them in the configuration, following corresponding the corresponding [Service page](/add-services/#available-services).

As an example, if your actual project is using PostgreSQL and Redis, edit your `.upsun/config.yaml` file and add the following:

```yaml {location=".upsun/config.yaml"}
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
{{% note theme="info" %}}
You need to declare your services in the `services` top YAML key and add a [`relationships`](/create-apps/image-properties/relationships.md) for each services in your 
`myapp` configuration. [Service environment variables](/development/variables/#service-environment-variables) will be automatically injected in your `myapp` container.
{{% /note %}}

### Configure how your application and workers starts

{{< codetabs >}}
+++
title=from DIY
+++

Find out how your actual application is started 
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

**Convert `Procfile` to `.uspun/config.yaml`:**

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
title=from vercel
+++

TBD 

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

{{% note theme="info" %}}
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

Please refer to [supported mount type](/create-apps/image-properties/mounts.md#define-a-mount) for more information about mount types.

## 8. Optional: Define a resource initialization strategy

By default, when you first deploy your project,
{{% vendor/name %}} allocates [default resources](/manage-resources/resource-init.md) to each of your containers.
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init.md#specify-a-resource-initialization-strategy) before pushing your code.

Alternatively, you can [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

## 9. Optional: Add environment variables

If your app requires [Environment variables] to build properly, [add them to your environment](/development/variables/set-variables.md).

Extrat existing environment variables in your project:

{{< codetabs >}}
+++
title=from DIY
+++

Ssh to your server and Use the `env` CLI command to list all your existing environment variable:
```bash {location="Terminal"}
ssh <YOUR-SERVER-IP>
env # it displays your environment variables
```

<--->
+++
title=from Heroku
+++

Display the list of Heroku environment variable: 

```bash {location="Terminal"}
heroku config # it displays your environment variables
```

<--->
+++
title=from vercel
+++

TBD 

{{< /codetabs >}}

Then create corresponding environment variables: 

```bash {location="Terminal"}
# Review and set in {{% vendor/name %}} with env: prefix for standard environment variables 
{{% vendor/cli %}} variable:create --level environment --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
# Or for project-wide variables
{{% vendor/cli %}} variable:create --level project --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
# Or for application specific variables
{{% vendor/cli %}} variable:create --app-scope myapp --name env:{{< variable "KEY" >}} --value {{< variable "VALUE" >}}
```

## 10. Push your changes

The way to push your code to {{% vendor/name %}} depends on
whether you're hosting your code with a third-party service using a [source integration](/integrations/source/_index.md).
If you aren't, your repository is hosted in {{% vendor/name %}}
and you can use the CLI or just Git itself.

{{% note theme="info" %}}
At this stage, we assume you already commit updated files (mainly `.upsun/config.yaml`) in your Git history, using: 
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


## 11. Test your production environment
When your {{% vendor/name %}} project is successfuly deployed: 

- **Verify service connections**: 
  - Check database connectivity 
  - Verify cache operations 
  - Test background worker execution
- **Load testing**: 
  - Compare performance to Heroku baseline 
  - Test autoscaling behavior if configured 
  - Verify resource allocation meets requirements
  - Example on how to use Gatling to load testing on your {{% vendor/name %}} project
- **Review logs and metrics**:

```bash {location="Terminal"}
{{% vendor/cli %}} logs app
{{% vendor/cli %}} metrics:all
```
- **Verify functionality**: 
  - Test critical user flows 
  - Confirm integrations working 
  - Check scheduled jobs executing

{{% note theme="info" %}}
If your application is deployed without error but you get a 502 error when loading your application, [have a look on the Troubleshoot page](/development/troubleshoot.md). 
{{% /note %}}

## 12. Optional maintenance mode

Please enable maintenance mode (if available in your app).

## 13. Import data

Once you have an environment, you can import the data from your actual project.
The exact process to import them may depend on the service you use.

{{< codetabs >}}
+++
title=from DIY
+++

Depending on the database engine you're using, download a dump of your database into a SQL file locally
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
title=from vercel
+++

TBD 

{{< /codetabs >}}

For SQL databases, for example, you can use a version of this command:

```bash
{{% vendor/cli %}} sql < {{< variable "BACKUP_FILE_NAME" >}}
```

For any potential more details, see the [specific service](/add-services/_index.md).

## 14. Import files

Your app may include content files, meaning files that aren't intended to be part of your codebase so aren't in Git.
You can upload such files to [mounts you created](/create-apps/image-properties/mounts.md).
Upload to each mount separately.

We assume that your already download your content files, ready to be uploaded.

Suppose you have the following mounts defined:

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

Then, to upload your files, run a command similar to the following:

```bash
{{% vendor/cli %}} mount:upload --mount web/uploads --source ./uploads
{{% vendor/cli %}} mount:upload --mount private --source ./private
```

Alternatively, you can upload to your mounts using a different [SSH method](/development/file-transfer.md#transfer-files-using-an-ssh-client).

## 15. Configure your Domain and update DNS records

Configure your domain, using either the CLI or the Console
```bash {location="Terminal"}
{{% vendor/cli %}} domain:add www.yourDomain.com
```

Then, you will need to add `CNAME` in your DNS records to point to the default url of your project: 
```bash {location="Terminal"}
{{% vendor/cli %}} environment:url
```

## 16. Invite teams and users

You can either invite individual users to your project, or create teams, and then invite users in teams (recommanded).

### Create a team and invite users in a team
We recommand to create a team and invite individual users in this team, as you would be able to manage access at the team level, instead of one-by-one users.

When creating a team for a project, a role is required: 

- at the Project level: `admin` or `viewer`
- for each environment types (`production`, `staging` and `development` ): `admin`, `contributor` or `viewer`

To create a team, you can either use the Console or the CLI:

```bash {location="Terminal"}
{{% vendor/cli %}} team:create --role viewer,production:viewer,staging:contributor,development:admin --label "My team"
```

To invite a user in a team, you can either use the Console or the CLI, and provide its user ID (if existing user) or its email address (we will send him an invitation):

```bash {location="Terminal"}
{{% vendor/cli %}} team:user:add {{< variable "USER_EMAIL_ADDRESS_OR_ID" >}}
```

{{% note theme="info" %}}
Each user invited in a team inherit team's role.
{{% /note %}}

### Invite users

When inviting individual users on a project, a role is required: 

- at the [Project level](/administration/users.md#project-roles): `admin` or `viewer`
- for each [Environment types](/administration/users.md#environment-type-roles) (`production`, `staging` and `development` ): `admin`, `contributor` or `viewer`

To invite individual users on a project, use the following CLI command:

```bash {location="Terminal"}
{{% vendor/cli %}} user:add --role viewer,production:viewer,staging:contributor,development:admin {{< variable "USER_EMAIL_ADDRESS" >}}
```

## 17. Monitor your application
TODO: Blackfire ? 


