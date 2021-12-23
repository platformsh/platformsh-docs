---
title: "Elixir"
description: Platform.sh supports building and deploying applications written in Elixir. There is no default flavor for the build phase, but you can define it explicitly in your build hook. Platform.sh Elixir images support both committed dependencies and download-on-demand. The underlying Erlang version is 22.0.7.
---

{{< description >}}

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="elixir" status="supported" environment="grid" >}} | {{< image-versions image="elixir" status="supported" environment="dedicated" >}} |

To specify an Elixir container, use the `type` property in your `.platform.app.yaml`.

{{< readFile file="src/registry/images/examples/full/elixir.app.yaml" highlight="yaml" >}}

## Platform.sh variables

Platform.sh exposes relationships and other configuration as [environment variables](../development/variables/_index.md).
Most notably, it allows a program to determine at runtime what HTTP port it should listen on
and what the credentials are to access [other services](../configuration/services/_index.md).

To get the `PORT` environment variable (the port on which your web application is supposed to listen) you would:

```elixir
String.to_integer(System.get_env("PORT") || "8888")
```

Some of the environment variables are in JSON format and are base64 encoded. You would need to import a JSON parsing library such as [Json](https://hexdocs.pm/json/readme.html) or [Poison](https://hexdocs.pm/poison/api-reference.html) to read those. (There is an example for doing this to decode the `PLATFORM_RELATIONSHIPS` environment variable in the section [below](#accessing-services-manually).)

{{< note title="Tip">}}
Remember `config/prod.exs` is evaluated at **build time** and will not have access to runtime configuration. Use `config/releases.exs` to configure your runtime environment.
{{< /note >}}

## Building and running the application

If you are using Hex to manage your dependencies, it will be necessary to specify a set of environment variables in your `.platform.app.yaml` file that define the `MIX_ENV` and `SECRET_KEY_BASE`, which can be set to the Platform.sh-provided `PLATFORM_PROJECT_ENTROPY` environment variable:

```yaml
variables:
    env:
        SECRET_KEY_BASE: $PLATFORM_PROJECT_ENTROPY
        MIX_ENV: 'prod'
```

Include in your build hook the steps to retrieve a local Hex and rebar, and then run `mix do deps.get, deps.compile, compile` on your application to build a binary.

{{< readFile file="src/registry/images/examples/full/elixir.hooks.app.yaml" highlight="yaml" >}}

{{< note >}}
The above build hook will work for most cases, and assumes that your `mix.exs` file is located at the root of your application.
{{< /note >}}

Assuming `mix.exs` is present at the root of your repository and your build hook matches the above, you can then start it from the `web.commands.start` directive.

{{< note >}}
The start command _must_ run in the foreground, so you should set the `--no-halt` flag when calling `mix run`.
{{< /note >}}

The following basic `.platform.app.yaml` file is sufficient to run most Elixir applications.

```yaml
name: app

type: elixir:1.9

variables:
    env:
        MIX_ENV: 'prod'
        SECRET_KEY_BASE: $PLATFORM_PROJECT_ENTROPY

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

Note that there will still be an Nginx proxy server sitting in front of your application. If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Elixir application unconditionally, as in the example above.

## Dependencies

The recommended way to handle Elixir dependencies on Platform.sh is using Hex. You can commit a `mix.exs` file in your repository and the system will download the dependencies in your `deps` section using the build hook above.

```elixir
  defp deps do
    [
	  {:platformshconfig, "~> 0.1.0"}
    ]
  end
```

## Accessing Services

The simplest possible way to go around this is to use the [Platform.sh Config Reader](https://hex.pm/packages/platformshconfig) library from hex. The library source is also available [on GitHub](https://github.com/platformsh/config-reader-elixir).

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

{{< readFile file="src/registry/images/examples/full/postgresql.app.yaml" highlight="yaml" >}}

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

## Project templates

Platform.sh offers a number of project templates using the structure described above. It can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="elixir" >}}
