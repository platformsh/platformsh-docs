---
title: "C#/.NET Core"
description: |
  Platform.sh supports deploying .NET applications by allowing developers to define a build process and pass its variables to the .NET Core build environment.
---

{{< description >}}

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="dotnet" status="supported" environment="grid" >}} | {{< image-versions image="dotnet" status="supported" environment="dedicated" >}} |

To specify a .NET Core container, use the `type` property in your `.platform.app.yaml`.

{{< readFile file="src/registry/images/examples/full/dotnet.app.yaml" highlight="yaml" >}}

## Building the application

For simple applications, using the [`dotnet publish`](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-publish?tabs=netcore21) default [framework-dependent deployment](https://docs.microsoft.com/en-us/dotnet/core/deploying/#framework-dependent-deployments-fdd) method is sufficient for building applications in .NET containers:

```yaml
hooks:
    build: |
        set -xe
        dotnet publish --output "$PLATFORM_OUTPUT_DIR" -p:UseRazorBuildServer=false -p:UseSharedCompilation=false
```

where `PLATFORM_OUTPUT_DIR` is the output directory for compiled languages available at build time.

Typically .NET Core builds will start a collection of build servers, which are helpful for repeated builds. On Platform.sh, however, if this process is not disabled, the build process will not finish until the idle timeout is reached.

As a result, it is recommended to include `-p` toggles that disable the Razor compiler for dynamic cshtml pages (`UseRazorBuildServer`) and the .NET msbuild compiler (`UseSharedCompilation`).

If making multiple builds is desired for your application, make sure to call `dotnet build-server shutdown` at the end of your build hook.

## Running the application

.NET Core applications should be started using the `web.commands.start` directive in `.platform.app.yaml`. This ensures that the command starts at the right moment and stops gracefully when a redeployment needs to be executed. Also, should the program terminate for any reason, it will be automatically restarted. Note that the start command _must_ run in the foreground.

Incoming requests are passed to the application using either a TCP (default) or UNIX socket. The application must use the [appropriate environment variable](/configuration/app/web.md#socket-family) to determine the URI to listen on. In case of a TCP socket ([recommended](https://go.microsoft.com/fwlink/?linkid=874850)), the application must listen on `http://127.0.0.1`, using the `PORT` environment variable.

There will be an Nginx server sitting in front of your application. Serving static content via Nginx is recommended, as this allows easy control of headers (including cache headers) and also has marginal performance benefits.

Note that HTTPS is also terminated at the Ngnix proxy, so the `app.UseHttpsRedirection();` line in `Startup.cs` should be removed. To force HTTPS-only, please refer to the [routes documentation](/configuration/routes/https.md#https).

The following example configures an environment to serve the static content folders commonly found in [ASP.NET MVC](https://dotnet.microsoft.com/apps/aspnet/mvc) templates using Nginx, while routing other traffic to the .NET application.

```yaml
web:
    locations:
        "/":
            root: "wwwroot"
            allow: true
            passthru: true
            rules:
                # Serve these common asset types with customs cache headers.
                \.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$:
                    allow: true
                    expires: 300s

    commands:
        start: "dotnet WebApplication1.dll"
```

You can also route all requests to the application unconditionally:

```yaml
web:
    locations:
        "/":
            allow: false
            passthru: true

    commands:
        start: "dotnet WebApplication1.dll"
```

## Project templates

Platform.sh offers project templates for .NET Core applications using the structure described above.  They can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="dotnet" >}}
