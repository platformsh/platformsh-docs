To connect DDEV with your Platform.sh account, use a Platform.sh API token.

First [create an API token](/administration/cli/api-tokens.md#2-create-a-platformsh-api-token) in the Console.

Then add the token to your DDEV configuration.
You can do so globally (easiest for most people):

```bash
ddev config global --web-environment-add=PLATFORMSH_CLI_TOKEN={{ `{{< variable "API_TOKEN" >}}` | .Page.RenderString }}
```

You can also add the token only to the project:

```bash
ddev config --web-environment-add=PLATFORMSH_CLI_TOKEN={{ `{{< variable "API_TOKEN" >}}` | .Page.RenderString }}
```
