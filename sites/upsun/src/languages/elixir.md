---
title: "Elixir"
description: "{{% vendor/name %}} supports building and deploying applications written in Elixir. There is no default flavor for the build phase, but you can define it explicitly in your build hook. {{% vendor/name %}} Elixir images support both committed dependencies and download-on-demand. The underlying Erlang version is 22.0.7."
---

{{% composable/disclaimer %}}

{{% description %}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="elixir" status="supported" environment="grid" >}}

{{% language-specification type="elixir" display_name="Elixir" %}}

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'elixir:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'elixir:{{% latest "elixir" %}}'
```

## Built-in variables

{{% vendor/name %}} exposes relationships and other configuration as [environment variables](../development/variables/_index.md).
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

```yaml {configFile="app"}
applications:
  myapp:
    type: 'elixir:{{% latest "elixir" %}}'
    variables:
      env:
        MIX_ENV: 'prod'
```
The `SECRET_KEY_BASE` variable is generated automatically based on the [`PLATFORM_PROJECT_ENTROPY` variable](../development/variables/use-variables.md#use-provided-variables).
You can change it.

Include in your build hook the steps to retrieve a local Hex and `rebar`, and then run `mix do deps.get, deps.compile, compile` on your application to build a binary.

```yaml {configFile="app"}
applications:
  myapp:
    type: 'elixir:{{% latest "elixir" %}}'
    hooks:
      build: |
        mix local.hex --force
        mix local.rebar --force
        mix do deps.get --only prod, deps.compile, compile
```

{{< note >}}

That build hook works for most cases and assumes that your `mix.exs` file is located at [your app root](/create-apps/app-reference/single-runtime-image.md#root-directory).

{{< /note >}}

Assuming `mix.exs` is present at your app root and your build hook matches the above,
you can then start it from the `web.commands.start` directive.

The following basic app configuration is sufficient to run most Elixir applications.


```yaml {configFile="app"}
applications:
  myapp:
    type: 'elixir:{{% latest "elixir" %}}'

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
        start: mix phx.server
      locations:
        /:
          allow: false
          passthru: true
```

Note that there is still an Nginx proxy server sitting in front of your application. If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Elixir application unconditionally, as in the example above.

## Dependencies

The recommended way to handle Elixir dependencies on {{% vendor/name %}} is using Hex.
You can commit a `mix.exs` file in your repository and the system downloads the dependencies in your `deps` section using the build hook above.

```elixir
  defp deps do
    [
	  {:platformshconfig, "~> 0.1.0"}
    ]
  end
```

## Accessing Services

{{% access-services version="2" %}}

### Accessing Services Manually

The services configuration is available in the environment variable `PLATFORM_RELATIONSHIPS`.

Given a [relationship](/create-apps/app-reference/single-runtime-image#relationships) defined in `{{< vendor/configfile "app" >}}`:

```yaml {configFile="app"}
applications:
  myapp:
    type: 'elixir:{{% latest "elixir" %}}'

    [...]

    # Relationships enable an app container's access to a service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      postgresql:
```

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
[postgresql_config | _tail] = relationships["postgresql"]

config :my_app, Repo,
  database: postgresql_config["path"],
  username: postgresql_config["username"],
  password: postgresql_config["password"],
  hostname: postgresql_config["host"]
```

and setup Ecto during the deploy hook:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      deploy: |
        mix do ecto.setup
```
