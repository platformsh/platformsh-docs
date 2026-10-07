<!-- shortcode start {{ .Name }} -->
{{ $name := .Get "name" }}
You now have a *project* running on {{ .Site.Params.vendor.name }}.
In many ways, a project is just a collection of tools around a Git repository.
Just like a Git repository, a project has branches, called *environments*.
Each environment can then be activated.
*Active* environments are built and deployed,
giving you a fully isolated running site for each active environment.

Once an environment is activated, your app is deployed through a cluster of containers.
You can configure these containers in three ways, each corresponding to a [YAML file](/learn/overview/yaml):

- **Configure apps** in a `{{ partial "vendor/configfile" (dict "context" . "config" "app") }}` file.
  This controls the configuration of the container where your app lives.
- **Add services** in a `{{ partial "vendor/configfile" (dict "context" . "config" "services") }}` file.
  This controls what additional services are created to support your app,
  such as databases or search servers.
  Each environment has its own independent copy of each service.
  If you're not using any services, you don't need this file.
- **Define routes** in a `{{ partial "vendor/configfile" (dict "context" . "config" "routes") }}` file.
  This controls how incoming requests are routed to your app or apps.
  It also controls the built-in HTTP cache.
  If you're only using the single default route, you don't need this file.

Start by creating empty versions of each of these files in your repository:

```bash
# Create empty {{ .Site.Params.vendor.name }}  configuration files
mkdir -p .platform && touch {{ partial "vendor/configfile" (dict "context" . "config" "services") }} && touch {{ partial "vendor/configfile" (dict "context" . "config" "routes") }}{{ if not (.Get "noService") }} && touch {{ partial "vendor/configfile" (dict "context" . "config" "app") }}{{ end }}
```

{{ if isset .Params "platformify" }}
Alternatively, you could use the `platformify` script to initialize these files.
This script downloads any missing files from the official template.
It doesn't affect any files you already created.

```bash
# Platformify your app and automatically download the missing configuration files
curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/platformify.sh | { bash /dev/fd/3 -t {{(.Get "platformify")}} ; } 3<&0
```

If you run this command on an empty folder, the entire template is downloaded.

{{ else if eq $name "Symfony" }}
Alternatively, you could use the Symfony CLI to initialize these files.
This command generates a sensible default configuration depending on your project
dependencies.

```bash
symfony project:init
git add . && git commit -m "Add {{ .Site.Params.vendor.name }} configuration files"
```

{{ end }}

Now that you've added these files to your project,
configure each one for {{ $name }} in the following sections.
Each section covers basic configuration options and presents a complete example
with comments on why {{ $name }} requires those values.
<!-- shortcode end {{ .Name }} -->
