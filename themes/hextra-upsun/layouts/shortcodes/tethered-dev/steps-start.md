<!-- shortcode start {{ .Name }} -->
1. Create a new environment based on production.

    ```bash
    {{ `{{< vendor/cli >}}` | .Page.RenderString }} branch new-feature {{ `{{< variable "PRODUCTION_ENVIRONMENT_NAME" >}}` | .Page.RenderString }}
    ```

    If you're using a [source integration](/integrations/source.html),
    open a merge/pull request.

2.  To open an SSH tunnel to the new environment's services, run the following command:

    ```bash
    {{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:open
    ```

    This command returns the addresses for SSH tunnels to all of your services.

3.  Export the `PLATFORMSH_RELATIONSHIPS` environment variable with information from the open tunnel:

    ```bash
    export PLATFORM_RELATIONSHIPS="$({{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:info --encode)"
    ```
<!-- shortcode end {{ .Name }} -->
