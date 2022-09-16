---
title: Update all the things
sidebarTitle: Updating
toc: false
description: |
  **The Platform.sh Rule:** Update Early, Update Often
---

{{% description %}}

Platform.sh periodically updates its container images for the latest security updates from upstream providers.
(PHP versions, Ruby versions, MariaDB versions, etc.).
These do not always happen immediately but when a security vulnerability is identified and released it tends to be fairly soon after.

However, these updates aren't automatically propagated to individual projects as that would involve potential customer downtime.
Instead, the latest available version of every requested container is loaded on each deploy to a given environment.
After a deploy you are always guaranteed to be running the latest Platform.sh-provided version of a container.

If you are using Platform.sh-provided [Let's Encrypt TLS certificates](../define-routes/https.md), your site is automatically redeployed approximately once every two months to ensure it always has an up to date certificate.
That also ensures your container versions are up to date at the same time.
