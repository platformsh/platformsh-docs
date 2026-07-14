<!-- shortcode start {{ .Name }} -->
To connect DDEV with your {{ .Site.Params.vendor.name }}  account, use a {{ .Site.Params.vendor.name }}  API token.

First [create an API token](/administration/cli/api-tokens.md#2-create-an-api-token) in the Console.

Then add the token to your DDEV configuration.
You can do so globally (easiest for most people):

```bash
ddev config global --web-environment-add={{ `{{< vendor/prefix_cli >}}` | .Page.RenderString }}_CLI_TOKEN={{ `{{< variable "API_TOKEN" >}}` | .Page.RenderString }}
```

You can also add the token only to the project:

```bash
ddev config --web-environment-add={{ `{{< vendor/prefix_cli >}}` | .Page.RenderString }}_CLI_TOKEN={{ `{{< variable "API_TOKEN" >}}` | .Page.RenderString }}
```
<!-- shortcode end {{ .Name }} -->
