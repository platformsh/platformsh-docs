<!-- shortcode start {{ .Name }} -->
{{ $source := .Get "source" }}
<!-- Bitbucket has two methods and so has an additional heading level -->
##{{ if eq $source "Bitbucket" }}#{{ end }} 3. Validate the integration

Verify that your integration is functioning properly [using the CLI](../overview.md#validate-integrations):

```bash
{{ `{{% vendor/cli %}} integration:validate` | .Page.RenderString }}
```

###{{ if eq $source "Bitbucket" }}#{{ end }} Add the webhook manually

If the integration was added with the correct permissions, the necessary webhook is added automatically.
If you see a message that the webhook wasn't added, add one manually.

{{ $reqdPerms := "Admin" }}
{{ $permsLink := "" }}
{{ if eq $source "Bitbucket" }}
  {{ $permsLink = "https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/" }}
{{ else if eq $source "GitHub" }}
  {{ $permsLink = "https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization#permissions-for-each-role" }}
{{ else if eq $source "GitLab" }}
  {{ $reqdPerms = "Maintainer or Owner" }}
  {{ $permsLink = "https://docs.gitlab.com/ee/user/permissions.html" }}
{{ end }}

To configure a webhook on a {{ $source }} repository,
you need to have {{ $reqdPerms }} [user permissions]({{ $permsLink }}).

1. Get the webhook URL by running this command: `{{ `{{< vendor/cli >}}` | .Page.RenderString }} integration:get --property hook_url`.
1. Copy the returned URL.
{{ .Inner }}

You can now start pushing code, creating new branches,
and opening {{ if eq $source "GitLab" }}merge{{ else }}pull{{ end }} requests
directly in your {{ $source }} repository.
Your {{ .Site.Params.vendor.name }} environments are automatically created and updated.
<!-- shortcode end {{ .Name }} -->
