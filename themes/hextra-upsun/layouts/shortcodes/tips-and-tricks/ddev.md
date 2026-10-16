<!-- shortcode start {{ .Name }} -->
You may find the following commands useful when using DDEV.

-   List all available DDEV commands:

    ```bash
    ddev
    ```

-   Open DDEV front office from the terminal:

    ```bash
    ddev launch
    ```

-   List all existing DDEV services for current project:

    ```bash
    ddev status
    ```

-   Start a shell session to your DDEV project’s web service:

    ```bash
    ddev ssh
    ```

-   Start a shell session to a specific service.
    Specify which DDEV service you want to connect to with the {{ `-s {{< variable "SERVICE_NAME" >}}` | .Page.RenderString }} option.
    So if your database has the name `db`, connect to it with the following command:

    ```bash
    ddev ssh -s db
    ```
<!-- shortcode end {{ .Name }} -->
