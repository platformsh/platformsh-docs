---
title: "Elixir"
description: Platform.sh supports building and deploying applications written in Elixir. There is no default flavor for the build phase, but you can define it explicitly in your build hook. Platform.sh Elixir images support both committed dependencies and download-on-demand. The underlying Erlang version is 22.0.7.
---

{{% description %}}

## Supported versions

| Grid and Dedicated Generation 3 | Dedicated |
|---------------------------------|-----------|
|  {{< image-versions image="elixir" status="supported" environment="grid" >}} | {{< image-versions image="elixir" status="supported" environment="dedicated" >}} |

{{% image-versions-legacy "elixir" %}}

{{% language-specification type="elixir" display_name="Elixir" %}}

## Platform.sh variables

Platform.sh exposes relationships and other configuration as [environment variables](../development/variables/_index.md).
Most notably, it allows a program to determine at runtime what HTTP port it should listen on
and what the credentials are to access [other services](../add-services/_index.md).

To get the `PORT` environment variable (the port on which your web application is supposed to listen) you would:

```elixir
String.to_integer(System.get_env("PORT") || "8888")
```

Some of the environment variables are in JSON format and are base64 encoded. You would need to import a JSON parsing library such as [JSON](https://hexdocs.pm/json/readme.html) or [Poison](https://hexdocs.pm/poison/api-reference.html) to read those. (There is an example for doing this to decode the `PLATFORM_RELATIONSHIPS` environment variable in the section [below](#accessing-services-manually).)

{{< note title="Tip">}}
Remember `config/prod.exs` is evaluated at **build time** and has no access to runtime configuration. Use `config/releases.exs` to configure your runtime environment.
{{< /note >}}

## Building and running the application

If you are using Hex to manage your dependencies, you need to specify the `MIX_ENV` environment variable:

```yaml {location=".platform.app.yaml"}
variables:
    env:
        MIX_ENV: 'prod'
```

The `SECRET_KEY_BASE` variable is generated automatically based on the [`PLATFORM_PROJECT_ENTROPY` variable](../development/variables/use-variables.md#use-platformsh-provided-variables).
You can change it.

Include in your build hook the steps to retrieve a local Hex and `rebar`, and then run `mix do deps.get, deps.compile, compile` on your application to build a binary.

{{< readFile file="src/registry/images/examples/full/elixir.hooks.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

{{< note >}}

That build hook works for most cases and assumes that your `mix.exs` file is located at [your app root](../create-apps/app-reference.md#root-directory).

{{< /note >}}

Assuming `mix.exs` is present at your app root and your build hook matches the above,
you can then start it from the `web.commands.start` directive.

{{< note >}}
The start command _must_ run in the foreground, so you should set the `--no-halt` flag when calling `mix run`.
{{< /note >}}

The following basic app configuration is sufficient to run most Elixir applications.

```yaml {location=".platform.app.yaml"}
name: app

type: elixir:1.9

variables:
    env:
        MIX_ENV: 'prod'

hooks:
    build: |
        mix local.hex --force
        mix local.rebar --force
        mix do deps.get --only prod, deps.compile, compile

web:
    commands:
        start: mix run --no-halt
    locations:
        /:
            allow: false
            passthru: true
```

Note that there is still an Nginx proxy server sitting in front of your application. If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Elixir application unconditionally, as in the example above.

## Dependencies

The recommended way to handle Elixir dependencies on Platform.sh is using Hex. 
You can commit a `mix.exs` file in your repository and the system downloads the dependencies in your `deps` section using the build hook above.

```elixir
  defp deps do
    [
	  {:platformshconfig, "~> 0.1.0"}
    ]
  end
```

## Accessing Services

{{% config-reader %}}
[Platform.sh Config Reader library](https://hex.pm/packages/platformshconfig) 
{{% /config-reader%}}

If you are building a Phoenix app for example, it would suffice to add a database to `.platform/services.yaml` and a relationship in `.platform.app.yaml`. Put the lib in your `deps` and, assuming you renamed the `prod.secret.exs` to `releases.exs` per the [Phoenix guide](https://hexdocs.pm/phoenix/releases.html), change:

```elixir
System.get_env("DATABASE_URL")
```

to

```elixir
Platformsh.Config.ecto_dsn_formatter("database")
```

See [Platform.sh Config Reader Documentation](https://hexdocs.pm/platformshconfig/Platformsh.Config.html) for the full API.

### Accessing Services Manually

The services configuration is available in the environment variable `PLATFORM_RELATIONSHIPS`.

Given a relationship defined in `.platform.app.yaml`:

{{< readFile file="src/registry/images/examples/full/postgresql.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

Assuming you have in `mix.exs` the Poison library to parse JSON:

```elixir
  defp deps do
    [
      {:poison, "~> 3.0"}
    ]
  end
```

And assuming you use `ecto` you could put in `config/config.exs`:

```elixir
relationships = Poison.decode!(Base.decode64!(System.get_env("PLATFORM_RELATIONSHIPS")))
[postgresql_config | _tail] = relationships["postgresdatabase"]

config :my_app, Repo,
  database: postgresql_config["path"],
  username: postgresql_config["username"],
  password: postgresql_config["password"],
  hostname: postgresql_config["host"]
```

and setup Ecto during the deploy hook:

```yaml
deploy: |
    mix do ecto.setup
```
