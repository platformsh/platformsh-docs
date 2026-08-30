<!-- shortcode start {{ .Name }} -->
{{ $name := "local" }}
{{ with .Get "name" }}
  {{ $name = . }}
{{ end }}
## Next steps

You can now use your local environment to develop changes for review on {{ .Site.Params.vendor.name }} environments.
The following examples show how you can take advantage of that.

### Onboard collaborators

It's essential for every developer on your team to have a local development environment to work on.
Place the {{ $name }} configuration into a script to ensure everyone has this.
You can merge this change into production.

1.  Create a new environment called `local-config`.
    ```bash
    symfony branch local-config
    ```

2.  Create an executable script to set up a local environment for a new {{ .Site.Params.vendor.name }} environment.

    ```bash
    touch init-local.sh && chmod +x init-local.sh
    ```

    Fill it with the following example:
<!-- shortcode end {{ .Name }} -->
