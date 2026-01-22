<!-- shortcode start {{ .Name }} -->
1.  When you've finished your work, close the tunnels to your services by running the following command:

    ```bash
    {{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:close --all -y
    ```
<!-- shortcode end {{ .Name }} -->
