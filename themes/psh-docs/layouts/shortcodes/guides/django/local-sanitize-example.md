<!-- shortcode start {{ .Name }} -->
### Sanitize data

It's often a compliance requirement to ensure that only a minimal subset of developers within an organization
have access to production data during their work.
By default, your production data is automatically cloned into _every_ child environment.

You can customize your deployments to include a script that sanitizes the data within every preview environment.

1.  Create a new environment called `sanitize-non-prod`.

2.  Follow the example on how to [sanitize PostgreSQL with Django](../../../development/sanitize-db/postgresql.md).
    This adds a sanitization script to your deploy hook that runs on all preview environments.

3.  Commit and push the revisions by running the following command:

    ```bash
    git add . && git commit -m "Add data sanitization" && git push platform sanitize-non-prod
    ```

4.  Merge the change into production.

    Once the script is merged into production, every preview environment created on {{ .Site.Params.vendor.name }}
    and all local environments contain sanitized data free of your users' personally identifiable information (PII).
<!-- shortcode end {{ .Name }} -->
