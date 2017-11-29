# Integrations

Platform.sh can easily be integrated with external services. 

We support native integrations with multiple services,
first and foremost Git hosting services such as Github, Gitlab or
Bitbucket. This way you can continue to use those tools for your
development workflow, and have environments created automatically
for your pull requests and branches.

You can also easily integrate our native integrations with performance
monitoring tools such as Blackfire, NewRelic or Tideways as well as
health notifications.. or create your own integration using our
webhooks.

With the CLI, you can list all your active integrations:

```bash
platform integrations
```

![Cli Integrations](/images/cli-integrations.png)

> **note**
> If you have created your account using the Bitbucket or GitHub oAuth Login, then in order to use the Platform CLI you will need to set up a password by visiting [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password).
