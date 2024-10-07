---
title: Change hooks in different environments
description: Change what runs in your hooks depending on the current environment type.
---

You might have certain commands you want to run only in certain environments.
For example enabling detailed logging in preview environments
or purging your CDN cache for production environments.

The `deploy` and `post_deploy` hooks can access all [runtime environment variables](../../development/variables/use-variables.md#use-provided-variables).
Use this to vary those hooks based on the environment.

Check the `PLATFORM_ENVIRONMENT_TYPE` variable to see if it's in a production environment:

```yaml {configFile="app"}
hooks:
  deploy: |
    if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
      # Run commands only when deploying to production
    else
      # Run commands only when deploying to development or staging environments
    fi
    # Commands to run regardless of the environment
```
