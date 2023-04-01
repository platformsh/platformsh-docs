---
title: "Symfony Integration"
sidebarTitle: "Integration"
weight: -105
description: |
    How to use the Symfony integration for a better Platform.sh experience.
---

If not done already, enable the Symfony integration by adding the following
line at the top of the build hook script:

```yaml {location=".platform.app.yaml"}
    hooks:
        build: |
            set -x -e
            curl -fs https://get.symfony.com/cloud/configurator | bash

            # ...
```

FIXME: "Symfony integration" explaining what it is and what it brings
FIXME: If project started with a "standard" platform config, then build and deploy should be used instead?!

 * Exposes additional infrastructure [environment variables](./environment-variables#symfony-environment-variables);
 * Exposes [environment variables for all services](./environment-variables#service-environment-variables);

## Croncape
FIXME: Should be described as linked from the env var docs MAILFROM