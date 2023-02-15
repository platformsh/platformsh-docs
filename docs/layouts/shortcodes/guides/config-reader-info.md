{{ $lang := .Get "lang" }}
You can get all information about a deployed environment,
including how to connect to services, through [environment variables]({{ relref . "/development/variables/_index.md" }}).
Your app can access these variables directly or use the [Config Reader library](https://github.com/platformsh/config-reader-{{ $lang }}).
It's a set of utilities to wrap the environment variables and make them easier to work with.

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
