1.  To commit and push the revisions, run the following command:

    ```bash
    git add . && git commit -m "Add local configuration" && git push platform local-config
    ```

1.  Merge the change into production.

Once the script is merged into production,
any user can set up their local environment by running the following commands:

```bash
{{ `$ platform get {{< variable "PROJECT_ID" >}}
$ cd {{< variable "PROJECT_NAME" >}}
$ ./init-local.sh {{< variable "PROJECT_ID" >}} another-new-feature {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}}` | .Page.RenderString }}
```
