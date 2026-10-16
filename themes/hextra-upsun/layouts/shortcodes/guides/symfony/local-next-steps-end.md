<!-- shortcode start {{ .Name }} -->
3.  Commit and push the revisions by running the following command:

    ```bash
    git add . && git commit -m "Add local configuration" && git push platform local-config
    ```

4.  Merge the change into production by running the following command:

    ```bash
    symfony merge local-config
    ```
5.  Grant access on the project to the new member of your team

    ```bash
    symfony user:add bob@example.com -r production:v -r development:c
    ```

    You can also use the Web Console to [add a new user to your project](/administration/users.html#add-a-user-to-a-project).


Once the script is merged into production,
any granted user can then set up their local environment by running the following commands:

```bash
{{ ` symfony get {{< variable "PROJECT_ID" >}}
 cd {{< variable "PROJECT_NAME" >}}
 ./init-local.sh {{< variable "PROJECT_ID" >}} another-new-feature main` | .Page.RenderString }}
```

<div class="bg-stone p-4 mb-4 [&amp;>p:last-child]:mb-0 [&amp;>h3]:mt-0" role="alert">
  <h3 class="font-bold text-base">Warning</h3>

  <p>Working on remote environment data can lead your local updates to be pushed in production and thus, crash your production website.
  Be careful when using this method.</p>
</div>


### Sanitize data

It's often a compliance requirement to ensure that only a minimal subset of developers within an organization
have access to production data during their work.
By default, your production data is automatically cloned into _every_ child environment.

You can customize your deployments to include a script that sanitizes the data within every preview environment.

1.  Create a new environment called `sanitize-non-prod`.
    ```bash
    symfony branch sanitize-non-prod
    ```

2.  Follow the example on how to [sanitize PostgreSQL with Symfony](../../../development/sanitize-db/postgresql-symfony.md).
    This adds a sanitization script to your deploy hook that runs on all preview environments.

3.  Commit and push the revisions by running the following command:

    ```bash
    git add . && git commit -m "Add data sanitization" && git push platform sanitize-non-prod
    ```

4.  Merge the change into production by running the following command:

    ```bash
    symfony merge sanitize-non-prod
    ```

Once the script is merged into production, every preview environment created on {{ .Site.Params.vendor.name }}
and all local environments contain sanitized data free of your users' personally identifiable information (PII).
<!-- shortcode end {{ .Name }} -->
