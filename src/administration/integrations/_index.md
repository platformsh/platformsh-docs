---
title: "Integrations"
weight: 3
layout: single
sidebarTitle: "External integrations"
description: |
  Platform.sh can easily be integrated with external services. We support native integrations with multiple services, first and foremost Git hosting services such as GitHub, GitLab, or Bitbucket.  You can continue to use those tools for your development workflow, and have Platform.sh environments created automatically for your pull requests and branches.
---

{{< description >}}

You can also easily add our native integrations with performance monitoring tools such as Blackfire, New Relic, or Tideways, as well as setting up health notifications.  Or create your own integration using our webhooks.

{{< note theme="warning" title="Important" >}}
Be aware that only a project administrator (someone with `admin` level access to the project) can add or remove integrations.  See [User administration](/administration/users/) for more details.
{{< /note >}}


## Listing active integrations

With the CLI, you can list all your active integrations:

```bash
platform integrations
```

![Cli Integrations](/images/cli/cli-integrations.png "0.5")

{{< note >}}
If you have created your account using the Bitbucket or GitHub oAuth Login, then in order to use the Platform.sh CLI you will need to set up a password by visiting [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password).
{{< /note >}}

## Validating integrations

Once your integration has been configured, you can validate that it is functioning properly with the command:

```bash
$ platform integration:validate -p <project ID>

Enter a number to choose an integration:
  [0] 5jutqdj2tvkde (health.slack)
  [1] a6555jyqp4gl2 (github)
 > 1

Validating the integration a6555jyqp4gl2 (type: github)...
The integration is valid.
```

{{< note >}}
The `-p` flag is unnecessary in the above command executed from your local repository if the Platform.sh project remote has been set.
{{< /note >}}
