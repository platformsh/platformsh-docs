{{ $name := "local" }}
{{ with .Get "name" }}
  {{ $name = . }}
{{ end }}
## Next steps

You can now use your local environment to develop changes for review on Platform.sh environments.
The following examples show how you can take advantage of that.

### Onboard collaborators

It's essential for every developer on your team to have a local development environment to work on. 
Place the {{ $name }} configuration into a script to ensure everyone has this.
You can merge this change into production. 

1.  Create a new environment called `local-config`.

1.  To set up a local environment for a new Platform.sh environment, create an executable script.

    ```bash
    touch init-local.sh && chmod +x init-local.sh
    ```
