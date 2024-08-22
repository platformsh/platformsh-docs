---
title: "Add a database"
weight: -130
description: |
  Once Your Strapi application has been deployed on {{% vendor/name %}}, you might want to add and configure a service to your application.
---

{{% description %}}

This guide will show you how to provision and connect to two different databases on {{% vendor/name %}}:

- PostgreSQL
- Oracle MySQL

## 1. Branch

Like all updates to your {{% vendor/name %}} projects, first create a new dedicated environment to test this change.

```bash
git checkout -b upgrade-db
```

## 2. Install the Node.js package

{{< codetabs >}}
+++
title=PostgreSQL
+++
```bash
yarn add pg
```
<--->

+++
title=Oracle MySQL
+++
```bash
yarn add mysql
```
{{< /codetabs >}}

## 3. Add a new service

Add a new service to your `.upsun/config.yaml` file:

{{< codetabs >}}
+++
title=PostgreSQL
+++
```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: "nodejs:20"

    [...]

services:
  database:
	  type: postgresql:{{% latest "postgresql" %}}
```
<--->

+++
title=Oracle MySQL
+++
```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: "nodejs:20"

    [...]

services:
  database:
	  type: oracle-mysql:{{% latest "oracle-mysql" %}}
```
{{< /codetabs >}}

## 4. Add a new relationship

Add a new relationship to your `.upsun/config.yaml` file to allow access to the new service

{{< codetabs >}}
+++
title=PostgreSQL
+++
```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: "nodejs:20"

    [...]

    relationships:
      database:

services:
  database:
	  type: postgresql:{{% latest "postgresql" %}}
```
<--->

+++
title=Oracle MySQL
+++
```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: "nodejs:20"

    [...]

    relationships:
      database:

services:
  database:
	  type: oracle-mysql:{{% latest "oracle-mysql" %}}
```
{{< /codetabs >}}

## 5. Update `.environment`

When you previously ran `upsun project:init`, the command generated some Strapi-specific environment variables:

```bash {location=".environment"}
# Set Strapi-specific environment variables
export DATABASE_HOST="$DB_HOST"
export DATABASE_PORT="$DB_PORT"
export DATABASE_NAME="$DB_PATH"
export DATABASE_USERNAME="$DB_USERNAME"
export DATABASE_PASSWORD="$DB_PASSWORD"
export DATABASE_SCHEME="$DB_SCHEME"

# Set secrets needed by Strapi, if they are not set
# Prefer setting these as project secret variables with {{% vendor/cli %}} variable:create env:SECRET_NAME --sensitive=true
if [[ -z "$ADMIN_JWT_SECRET" ]]; then
  export ADMIN_JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$JWT_SECRET" ]]; then
  export JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$API_TOKEN_SALT" ]]; then
    export API_TOKEN_SALT="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$APP_KEYS" ]]; then
    export APP_KEYS="$PLATFORM_PROJECT_ENTROPY"
fi
```

{{% vendor/name %}} will actually generate service credentials automatically for you in the runtime container, so we don't need the first half of this file anymore.
Remove the first block (pertaining to `DATABASE` credentials).

Then, add a single additional variable that will set the `DATABASE_CLIENT` variable at the appropriate time:

{{< codetabs >}}
+++
title=PostgreSQL
+++
```bash {location=".environment"}
# Set secrets needed by Strapi, if they are not set
# Prefer setting these as project secret variables with {{% vendor/cli %}} variable:create env:SECRET_NAME --sensitive=true
if [[ -z "$ADMIN_JWT_SECRET" ]]; then
  export ADMIN_JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$JWT_SECRET" ]]; then
  export JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$API_TOKEN_SALT" ]]; then
    export API_TOKEN_SALT="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$APP_KEYS" ]]; then
    export APP_KEYS="$PLATFORM_PROJECT_ENTROPY"
fi

# Switch to configure to the production database service _only_ at deploy time.
if [[ -z "$PLATFORM_ENVIRONMENT" ]]; then
    export DATABASE_CLIENT="postgres"
fi
```
<--->

+++
title=Oracle MySQL
+++
```bash {location=".environment"}
# Set secrets needed by Strapi, if they are not set
# Prefer setting these as project secret variables with {{% vendor/cli %}} variable:create env:SECRET_NAME --sensitive=true
if [[ -z "$ADMIN_JWT_SECRET" ]]; then
  export ADMIN_JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$JWT_SECRET" ]]; then
  export JWT_SECRET="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$API_TOKEN_SALT" ]]; then
    export API_TOKEN_SALT="$PLATFORM_PROJECT_ENTROPY"
fi
if [[ -z "$APP_KEYS" ]]; then
    export APP_KEYS="$PLATFORM_PROJECT_ENTROPY"
fi

# Switch to configure to the production database service _only_ at deploy time.
if [[ -z "$PLATFORM_ENVIRONMENT" ]]; then
    export DATABASE_CLIENT="mysql"
fi
```
{{< /codetabs >}}

## 6. Push to the environment

Commit and push the changes to the {{% vendor/name %}} environment:

```bash
git commit -am "Add a new service"
git push origin upgrade-db
```

{{< note theme="info">}}
If you are using {{% vendor/name %}} as your primary remote, you can use the `{{% vendor/cli %}} branch` and `{{% vendor/cli %}} push` commands directly.
If instead you had already set up an integration to GitHub, GitLab or Bitbucket, make sure to open a pull/merge request to judge the revision.
{{< /note >}}
