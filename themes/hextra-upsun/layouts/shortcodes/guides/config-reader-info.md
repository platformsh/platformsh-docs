<!-- shortcode start {{ .Name }} -->
{{ $lang := .Get "lang" }}
You can get all information about a deployed environment,
including how to connect to services, through [environment variables]({{ relref . "/development/variables/_index.md" }}).
Your app can [access these variables]({{ relref . "development/variables/use-variables.md#access-variables-in-your-app" }}).

{{ if eq $lang "nodejs" }}
Install the package with your preferred package manager:

```bash
npm install platformsh-config

# Or for Yarn
yarn add platformsh-config
```
{{ end }}

{{ if eq $lang "php" }}
The following examples use it, so install it through Composer if you haven't already.

```bash
composer require platformsh/config-reader
```
{{ end }}
<!-- shortcode end {{ .Name }} -->
