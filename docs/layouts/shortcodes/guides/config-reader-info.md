{{ $lang := .Get "lang" }}
Platform.sh provides all information about the running environment,
including how to connect to services, through [environment variables]({{ relref . "/development/variables/_index.md" }}).
These may be accessed directly, but it's often easier to use the Platform.sh [Config Reader library](https://github.com/platformsh/config-reader-{{ $lang }}).
It's a set of utilities to wrap the environment variables and make them a bit more ergonomic to work with.

{{ if eq $lang "nodejs" }}
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
