# Integrations

Platform.sh can easily be integrated with external services.

We support native integrations with multiple services, first and foremost Git hosting services such as GitHub, GitLab, or Bitbucket.  You can continue to use those tools for your development workflow, and have Platform.sh environments created automatically for your pull requests and branches.

You can also easily add our native integrations with performance monitoring tools such as Blackfire, New Relic, or Tideways, as well as setting up health notifications.  Or create your own integration using our webhooks.

Be aware that only a project administrator (someone with `admin` level access to the project) can add or remove integrations.  See [User administration](/administration/users.md) for more details.

With the CLI, you can list all your active integrations:

```bash
platform integrations
```

![Cli Integrations](/images/cli/cli-integrations.png)

Once your integrations have been configured, you can validate that they are functioning properly with the command (the `-p` flag is unnecessary from within your local project repository):

```
platform integration:validate -p <project ID>
```

> **note**
> If you have created your account using the Bitbucket or GitHub oAuth Login, then in order to use the Platform.sh CLI you will need to set up a password by visiting [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password).
