<!-- shortcode start {{ .Name }} -->
The best way to connect your local DDEV to your {{ .Site.Params.vendor.name }} project is through the [{{ .Site.Params.vendor.name }}  DDEV add-on](https://github.com/ddev/ddev-platformsh).
To add it, run the following command:

```bash
ddev get ddev/ddev-platformsh
```

Answer the interactive prompts with your project ID and the name of the environment to pull data from.

With the add-on, you can now run `ddev platform <command>` from your computer without needing to install the {{ .Site.Params.vendor.name }}  CLI.
<!-- shortcode end {{ .Name }} -->
