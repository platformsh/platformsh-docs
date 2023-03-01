1.  Create a new environment based on production.

    ```bash
    platform branch new-feature {{ `{{< variable "PRODUCTION_ENVIRONMENT_NAME" >}}` | .Page.RenderString }}
    ```

    If you're using a [source integration](/integrations/source.html),
    open a merge/pull request.

2.  To open an SSH tunnel to the new environment's services, run the following command:

    ```bash
    platform tunnel:open
    ```

    This command returns the addresses for SSH tunnels to all of your services.

3.  Export the `PLATFORMSH_RELATIONSHIPS` environment variable with information from the open tunnel:

    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```
