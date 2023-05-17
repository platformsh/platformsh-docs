{{ $source := .Get "source" }}
<!-- Bitbucket has two methods and so has an additional heading level -->
##{{ if eq $source "Bitbucket" }}#{{ end }} 3. Validate the integration

Verify that your integration is functioning properly [using the CLI](../overview.md#validating-integrations):

```bash
platform integration:validate
```

###{{ if eq $source "Bitbucket" }}#{{ end }} Add the webhook manually

If the integration was added with the correct permissions, the necessary webhook is added automatically.
If you see a message that the webhook wasn't added, add one manually.

{{ if eq $source "Bitbucket" }}
To configure a webhook on a {{ $source }} repository,
you need to have Admin [user permissions](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/).
{{ end }}
{{ if eq $source "GitHub" }}
To configure a webhook on a {{ $source }} repository,
you need to have Admin [user permissions](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization#permissions-for-each-role).
{{ end }}
{{ if eq $source "GitLab" }}
To configure a webhook on a {{ $source }} repository,
you need to have Maintainer or Owner [user permissions](https://docs.gitlab.com/ee/user/permissions.html).
{{ end }}

1. Get the webhook URL by running this command: `platform integration:get --property hook_url`.
1. Copy the returned URL.
{{ .Inner }}

You can now start pushing code, creating new branches,
and opening {{ if eq $source "GitLab" }}merge{{ else }}pull{{ end }} requests directly in your {{ $source }} repository.
Your Platform.sh environments are automatically created and updated.
