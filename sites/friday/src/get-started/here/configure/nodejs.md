---
title: JavaScript/Node.js
weight: 10
# description: All you need to know about creating a new project with {{% vendor/name %}}
---

When dealing with Javascript/Node.js stacks, these are all useful information that you need.

## Available package managers

* *npm*; example: ``npm install platformsh-config``
* *npx*; example: ``npx create-strapi-app <APP_NAME>``
* *bun*; example: ``bun install platformsh-config``

## Use nvm
If you want to get more info about usage of NVM, please see [dedicated doc page](/languages/nodejs/node-version.md#use-nvm)

## Sample of {{% vendor/configfile "apps" %}}
This is some sample of most common Node.js framework config files:

{{< codetabs >}}

+++
title=Next.js
+++

```yaml {location="{{% vendor/configfile "apps" %}}"}
applications:
  app:
    source:
      root: "/"
    type: "nodejs:20"
    web:
      commands:
        start: "npx next start -p $PORT"
    build:
      flavor: none
    dependencies:
      nodejs:
        sharp: "*"
#services:
#  db:
#    type: postgresql:15
routes:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

<--->
+++
title=Express
+++

```yaml {location="{{% vendor/configfile "apps" %}}"}
applications:
  app:
    source:
      root: "/"
    type: "nodejs:20"
    web:
      commands:
        start: "node index.js"
    build:
      flavor: none
    dependencies:
      nodejs:
        sharp: "*"
#services:
#  db:
#    type: postgresql:14
routes:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```


<--->
+++
title=Strapi
+++

```yaml {location=".{{% vendor/cli %}}/config.yaml"}
applications:
  app:
    source:
      root: "/"
    type: "nodejs:20"
    relationships:
      postgresql: "postgresql:postgresql"
    mounts:
      ...
    web:
      commands:
        start: "NODE_ENV=production yarn start"
    build:
      flavor: none
    dependencies:
      nodejs:
        yarn: "^1.22.0"
    hooks:
      build: |
        set -eux
        yarn
        yarn build
services:
  postgresql:
    type: postgresql:15 # All available versions are: 15, 14, 13, 12, 11

routes:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

{{< /codetabs >}}
