---
title: Third party integrations
weight: 75
---

In this guide, you've configured and deployed a local copy of your codebase to {{% vendor/name %}}.
You can continue to work, but the primary remote your team would share would be {{% vendor/name %}} itself.

It's more likely that your codebase is on a third party Git service like GitHub, GitLab, or Bitbucket.

Now that you've learned the basics of {{% vendor/name %}} configuration and deployment, you can create new projects within the management console, by choosing the **Connect repository** option to set up a GitHub application.

At this stage, if you want to make another remote (i.e. `origin`) the primary remote, and {{% vendor/name %}} a deployment mirror, you can override your current configuration by setting up an integration:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Once the integration is added, all commits on the service are mirrored, built, and deployed on {{% vendor/name %}}.

{{< guide-buttons previous="Back" next="Getting support" nextLink="/get-started/here/support" type="*" >}}
