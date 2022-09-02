{{ $name := .Get "name" }}
The end goal of this guide is to deploy your {{ $name }} app to a *project* on Platform.sh.
In many ways, a project is just a collection of tools around a Git repository.
A project replicates the branching structure of a repository exactly, but with one important addition:
any branch can be *activated* to become an *environment* on Platform.sh.
Activated environments go through Platform.sh's build and deploy phases,
resulting in a fully isolated running site for each activated branch (or pull request) on that repository.

Once an environment is activated, Platform.sh provisions a cluster of containers to deploy your app.
The configuration of that cluster is controlled by three [YAML files]({{ relref . "/overview/yaml/_index.md" }}):

- `.platform/routes.yaml` controls how incoming requests are routed to your app, or apps in a multi-app setup.
  It also controls the built-in HTTP cache.
  If you're only using the single default route, you don't need this file.
- `.platform/services.yaml` controls what additional services are created to support your app,
  such as databases or search servers.
  Each environment has its own independent copy of each service.
  If you're not using any services, you don't need this file.
- `.platform.app.yaml` controls the configuration of the container where your app lives.
  It's the most powerful configuration file with the most options.
  So it can get somewhat long depending on your configuration.

Each project on Platform.sh needs at least the last file and each file can be customized however you need.
But most {{ $name }} sites have a fairly similar configuration, at least to start.

You can start by creating empty versions of each of these files in your repository:

{{ $configComment := "# Create empty Platform.sh configuration files" }}
{{ $configContent := "touch .platform.app.yaml && mkdir -p .platform && touch .platform/routes.yaml" }}
{{ $configContent2 := "" }}
{{ if not (.Get "noService") }}
    {{ $configContent2 := printf "&& touch .platform/services.yaml" }}
{{ end }}
{{- highlight (printf "%s\n%s%s" $configComment $configContent $configContent2 ) "bash" "" -}}

{{ if isset .Params "platformify" }}
Alternatively, you could use the `platformify` script to initialize these files.
This script downloads any missing files from the official template.
It doesn't affect any files you already created.

{{ $platformifyComment := "# Platformify your app and automatically download the missing configuration files" }}
{{ $platformifyContent := printf "curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/platformify.sh | { bash /dev/fd/3 -t %s ; } 3<&0" (.Get "platformify") }}
{{- highlight (printf "%s\n%s" $platformifyComment $platformifyContent ) "bash" "" -}}

When run on an empty folder, the entire template can be downloaded locally.

{{ end }}

Now that you've added these files to your project,
you can go through and configure each of them for {{ $name }} one by one in the sections below.
Each section covers a particular configuration file, defines what each attribute configures,
and then shows a final code snippet that includes the recommended configuration for {{ $name }} pulled from its template.
Within that snippet, be sure to read each of the comments
as they provide additional information and reasoning for why {{ $name }} requires those values.
